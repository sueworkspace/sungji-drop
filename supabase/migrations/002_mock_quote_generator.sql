-- ================================================================
-- 002_mock_quote_generator.sql — Mock 견적 자동 생성 함수
-- ================================================================
-- 딜러 앱이 없는 동안 견적 요청 시 2~5개의 가상 견적을
-- 자동으로 생성하는 서버 함수.
-- 호출: supabase.rpc('generate_mock_quotes', { p_request_id })
-- ================================================================

CREATE OR REPLACE FUNCTION public.generate_mock_quotes(p_request_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request        RECORD;
  v_original_price INTEGER;
  v_user_id        UUID;
  v_dealer         RECORD;
  v_num_quotes     INTEGER;
  v_device_price   INTEGER;
  v_monthly_fee    INTEGER;
  v_subsidy        INTEGER;
  v_add_discount   INTEGER;
  v_total_cost     INTEGER;
  v_message        TEXT;
  v_monthly_fees   INTEGER[] := ARRAY[55000, 69000, 79000, 89000, 95000, 110000];
  v_subsidies      INTEGER[] := ARRAY[0, 50000, 100000, 150000, 200000, 250000];
  v_add_discounts  INTEGER[] := ARRAY[0, 0, 30000, 50000, 80000, 100000];
  v_messages       TEXT[] := ARRAY[
    '안녕하세요! 최저가로 모실 수 있습니다. 편하게 문의 주세요 😊',
    '지금 재고 있습니다! 오늘 방문하시면 추가 할인 가능합니다.',
    '이번 주 특가 진행 중입니다. 빠른 연락 부탁드립니다!',
    '성지 최저가 자신 있습니다. 타 견적 대비 더 낮춰드릴게요.',
    '당일 개통 가능하며 사은품도 준비되어 있습니다!'
  ];
BEGIN
  -- ----------------------------------------------------------------
  -- 1. 견적 요청 정보 조회 + 기기 출고가 가져오기
  -- ----------------------------------------------------------------
  SELECT qr.user_id, d.original_price
    INTO v_user_id, v_original_price
    FROM public.quote_requests qr
    JOIN public.devices d ON d.id = qr.device_id
   WHERE qr.id = p_request_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION '견적 요청을 찾을 수 없습니다: %', p_request_id;
  END IF;

  -- ----------------------------------------------------------------
  -- 2. 랜덤 견적 수 결정 (2 ~ 5)
  -- ----------------------------------------------------------------
  v_num_quotes := 2 + floor(random() * 4)::INTEGER;  -- 2, 3, 4, or 5

  -- ----------------------------------------------------------------
  -- 3. 활성/인증 딜러 중 랜덤으로 선택 후 견적 생성
  -- ----------------------------------------------------------------
  FOR v_dealer IN
    SELECT id, store_name
      FROM public.dealers
     WHERE is_active = TRUE
       AND is_verified = TRUE
     ORDER BY random()
     LIMIT v_num_quotes
  LOOP
    -- 기기 가격: 출고가 - 할인 (100,000 ~ 400,000)
    v_device_price := v_original_price - (100000 + floor(random() * 300001)::INTEGER);
    IF v_device_price < 0 THEN
      v_device_price := 0;
    END IF;

    -- 월 요금제 (배열에서 랜덤 선택)
    v_monthly_fee := v_monthly_fees[1 + floor(random() * array_length(v_monthly_fees, 1))::INTEGER];

    -- 공시지원금 (배열에서 랜덤 선택)
    v_subsidy := v_subsidies[1 + floor(random() * array_length(v_subsidies, 1))::INTEGER];

    -- 추가 할인 (배열에서 랜덤 선택)
    v_add_discount := v_add_discounts[1 + floor(random() * array_length(v_add_discounts, 1))::INTEGER];

    -- 24개월 총 비용 계산
    v_total_cost := (v_monthly_fee * 24) + v_device_price - v_subsidy - v_add_discount;
    IF v_total_cost < 0 THEN
      v_total_cost := 0;
    END IF;

    -- 딜러 메시지 (배열에서 랜덤 선택)
    v_message := v_messages[1 + floor(random() * array_length(v_messages, 1))::INTEGER];

    -- ----------------------------------------------------------------
    -- 4. 견적 INSERT
    -- ----------------------------------------------------------------
    INSERT INTO public.quotes (
      request_id,
      dealer_id,
      device_price,
      monthly_fee,
      subsidy,
      additional_discount,
      total_cost_24m,
      message,
      status
    ) VALUES (
      p_request_id,
      v_dealer.id,
      v_device_price,
      v_monthly_fee,
      v_subsidy,
      v_add_discount,
      v_total_cost,
      v_message,
      'pending'
    );

    -- ----------------------------------------------------------------
    -- 5. 사용자 알림 INSERT (견적 1건당 알림 1건)
    -- ----------------------------------------------------------------
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      body,
      data
    ) VALUES (
      v_user_id,
      'new_quote',
      '새 견적이 도착했습니다!',
      v_dealer.store_name || '에서 견적을 보냈습니다.',
      jsonb_build_object(
        'request_id', p_request_id,
        'dealer_id', v_dealer.id
      )
    );
  END LOOP;
END;
$$;

COMMENT ON FUNCTION public.generate_mock_quotes(UUID)
  IS '딜러 앱 구현 전까지 사용하는 mock 견적 자동 생성 함수 (2~5개)';
