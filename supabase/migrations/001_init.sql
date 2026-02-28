-- ================================================================
-- 001_init.sql — 성지DROP 역경매 플랫폼 초기 스키마
-- ================================================================
-- 실행 순서: Supabase Dashboard > SQL Editor 에 붙여넣기
-- 또는 Supabase CLI: supabase db push
-- ================================================================

-- UUID 생성 확장
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------
-- 1. profiles
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    TEXT        NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS '사용자 프로필 (auth.users 와 1:1)';

-- ----------------------------------------------------------------
-- 2. devices — 기기 카탈로그
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.devices (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT        NOT NULL,
  brand            TEXT        NOT NULL CHECK (brand IN ('samsung', 'apple', 'google', 'other')),
  model_number     TEXT        NOT NULL UNIQUE,
  storage_options  TEXT[]      NOT NULL DEFAULT '{}',
  color_options    TEXT[]      NOT NULL DEFAULT '{}',
  image_url        TEXT,
  original_price   INTEGER     NOT NULL CHECK (original_price >= 0),  -- 출고가 (원)
  release_date     DATE,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.devices IS '판매 가능한 휴대폰 기기 목록';

CREATE INDEX IF NOT EXISTS idx_devices_brand    ON public.devices (brand);
CREATE INDEX IF NOT EXISTS idx_devices_active   ON public.devices (is_active);

-- ----------------------------------------------------------------
-- 3. dealers — 딜러 (성지 판매점)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dealers (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_name       TEXT        NOT NULL,
  business_number  TEXT        NOT NULL UNIQUE,  -- 사업자등록번호
  region           TEXT        NOT NULL,
  address          TEXT        NOT NULL,
  phone            TEXT        NOT NULL,
  rating           NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count     INTEGER     NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  is_verified      BOOLEAN     NOT NULL DEFAULT FALSE,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.dealers IS '인증된 휴대폰 판매 딜러 (성지 업체)';

CREATE INDEX IF NOT EXISTS idx_dealers_region    ON public.dealers (region);
CREATE INDEX IF NOT EXISTS idx_dealers_verified  ON public.dealers (is_verified);
CREATE INDEX IF NOT EXISTS idx_dealers_active    ON public.dealers (is_active);
CREATE INDEX IF NOT EXISTS idx_dealers_user_id   ON public.dealers (user_id);

-- ----------------------------------------------------------------
-- 4. quote_requests — 사용자의 견적 요청
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id           UUID        NOT NULL REFERENCES public.devices(id),
  storage             TEXT        NOT NULL,
  color               TEXT        NOT NULL,
  carrier             TEXT        NOT NULL CHECK (carrier IN ('SKT', 'KT', 'LGU+', '알뜰폰')),
  plan_type           TEXT        NOT NULL,
  trade_in_device     TEXT,
  trade_in_condition  TEXT        CHECK (trade_in_condition IN ('S', 'A', 'B', 'C')),
  additional_notes    TEXT,
  status              TEXT        NOT NULL DEFAULT 'open'
                        CHECK (status IN ('open', 'quoted', 'accepted', 'completed', 'expired', 'cancelled')),
  expires_at          TIMESTAMPTZ NOT NULL,
  quote_count         INTEGER     NOT NULL DEFAULT 0 CHECK (quote_count >= 0),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.quote_requests IS '사용자가 등록한 역경매 견적 요청';

CREATE INDEX IF NOT EXISTS idx_qr_user_id    ON public.quote_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_qr_device_id  ON public.quote_requests (device_id);
CREATE INDEX IF NOT EXISTS idx_qr_status     ON public.quote_requests (status);
CREATE INDEX IF NOT EXISTS idx_qr_expires_at ON public.quote_requests (expires_at);
CREATE INDEX IF NOT EXISTS idx_qr_created_at ON public.quote_requests (created_at DESC);

-- ----------------------------------------------------------------
-- 5. quotes — 딜러가 제출한 견적
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotes (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id           UUID        NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
  dealer_id            UUID        NOT NULL REFERENCES public.dealers(id) ON DELETE CASCADE,
  device_price         INTEGER     NOT NULL CHECK (device_price >= 0),
  monthly_fee          INTEGER     NOT NULL CHECK (monthly_fee >= 0),
  subsidy              INTEGER     NOT NULL DEFAULT 0 CHECK (subsidy >= 0),
  additional_discount  INTEGER     NOT NULL DEFAULT 0 CHECK (additional_discount >= 0),
  -- total_cost_24m = (monthly_fee * 24) + device_price - subsidy - additional_discount
  total_cost_24m       INTEGER     NOT NULL CHECK (total_cost_24m >= 0),
  message              TEXT,
  status               TEXT        NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 딜러는 동일 요청에 견적을 1번만 제출 가능
  UNIQUE (request_id, dealer_id)
);

COMMENT ON TABLE public.quotes IS '딜러가 제출한 역경매 입찰 견적';

CREATE INDEX IF NOT EXISTS idx_quotes_request_id  ON public.quotes (request_id);
CREATE INDEX IF NOT EXISTS idx_quotes_dealer_id   ON public.quotes (dealer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status      ON public.quotes (status);
CREATE INDEX IF NOT EXISTS idx_quotes_total_cost  ON public.quotes (total_cost_24m ASC);

-- ----------------------------------------------------------------
-- 6. chat_rooms — 견적 수락 후 생성되는 채팅방
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id            UUID        NOT NULL UNIQUE REFERENCES public.quotes(id) ON DELETE CASCADE,
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dealer_id           UUID        NOT NULL REFERENCES public.dealers(id) ON DELETE CASCADE,
  last_message        TEXT,
  last_message_at     TIMESTAMPTZ,
  user_unread_count   INTEGER     NOT NULL DEFAULT 0 CHECK (user_unread_count >= 0),
  dealer_unread_count INTEGER     NOT NULL DEFAULT 0 CHECK (dealer_unread_count >= 0),
  is_active           BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.chat_rooms IS '견적 수락 후 생성되는 1:1 채팅방';

CREATE INDEX IF NOT EXISTS idx_chat_rooms_user_id    ON public.chat_rooms (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_dealer_id  ON public.chat_rooms (dealer_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_quote_id   ON public.chat_rooms (quote_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_last_msg   ON public.chat_rooms (last_message_at DESC);

-- ----------------------------------------------------------------
-- 7. messages — 채팅 메시지
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id       UUID        NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type   TEXT        NOT NULL CHECK (sender_type IN ('user', 'dealer')),
  content       TEXT        NOT NULL,
  message_type  TEXT        NOT NULL DEFAULT 'text'
                  CHECK (message_type IN ('text', 'image', 'quote_update')),
  is_read       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.messages IS '채팅방 메시지';

CREATE INDEX IF NOT EXISTS idx_messages_room_id    ON public.messages (room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id  ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read    ON public.messages (is_read) WHERE is_read = FALSE;

-- ----------------------------------------------------------------
-- 8. notifications — 인앱 알림
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL
                CHECK (type IN ('new_quote', 'quote_accepted', 'chat_message', 'quote_expired', 'system')),
  title       TEXT        NOT NULL,
  body        TEXT        NOT NULL,
  data        JSONB,
  is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.notifications IS '인앱 알림 (푸시 알림과 별도)';

CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read    ON public.notifications (is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);

-- ================================================================
-- TRIGGERS
-- ================================================================

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles.updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- quote_requests.updated_at
CREATE TRIGGER set_quote_requests_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- quotes.updated_at
CREATE TRIGGER set_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------
-- 신규 회원가입 시 profile 자동 생성 트리거
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nickname',
      SPLIT_PART(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------
-- 견적 등록 시 quote_requests.quote_count 자동 증가
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_quote()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.quote_requests
  SET
    quote_count = quote_count + 1,
    status = CASE WHEN status = 'open' THEN 'quoted' ELSE status END
  WHERE id = NEW.request_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_quote_created
  AFTER INSERT ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_quote();

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- RLS 활성화
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications   ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- profiles RLS
-- ----------------------------------------------------------------
CREATE POLICY "본인 프로필 조회" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "본인 프로필 수정" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "본인 프로필 생성" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------
-- devices RLS — 모든 인증 사용자가 읽기 가능
-- ----------------------------------------------------------------
CREATE POLICY "기기 목록 공개 조회" ON public.devices
  FOR SELECT USING (is_active = TRUE);

-- ----------------------------------------------------------------
-- dealers RLS — 활성 딜러는 누구나 조회 가능
-- ----------------------------------------------------------------
CREATE POLICY "딜러 목록 공개 조회" ON public.dealers
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "딜러 본인 프로필 관리" ON public.dealers
  FOR ALL USING (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- quote_requests RLS
-- ----------------------------------------------------------------
CREATE POLICY "사용자 본인 견적요청 관리" ON public.quote_requests
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "딜러는 공개 견적요청 조회" ON public.quote_requests
  FOR SELECT USING (
    status IN ('open', 'quoted')
    AND expires_at > NOW()
    AND EXISTS (
      SELECT 1 FROM public.dealers d
      WHERE d.user_id = auth.uid() AND d.is_active = TRUE
    )
  );

-- ----------------------------------------------------------------
-- quotes RLS
-- ----------------------------------------------------------------
-- 딜러: 본인이 제출한 견적 관리
CREATE POLICY "딜러 본인 견적 관리" ON public.quotes
  FOR ALL USING (
    dealer_id IN (
      SELECT id FROM public.dealers WHERE user_id = auth.uid()
    )
  );

-- 딜러: open/quoted 요청에 새 견적 제출
CREATE POLICY "딜러 견적 생성" ON public.quotes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.dealers d
      WHERE d.id = dealer_id AND d.user_id = auth.uid() AND d.is_active = TRUE
    )
    AND EXISTS (
      SELECT 1 FROM public.quote_requests qr
      WHERE qr.id = request_id
        AND qr.status IN ('open', 'quoted')
        AND qr.expires_at > NOW()
    )
  );

-- 사용자: 본인 견적요청에 온 견적 조회
CREATE POLICY "사용자 본인 요청의 견적 조회" ON public.quotes
  FOR SELECT USING (
    request_id IN (
      SELECT id FROM public.quote_requests WHERE user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- chat_rooms RLS — 참여자만 조회
-- ----------------------------------------------------------------
CREATE POLICY "채팅방 참여자 조회" ON public.chat_rooms
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.uid() IN (
      SELECT user_id FROM public.dealers WHERE id = dealer_id
    )
  );

CREATE POLICY "채팅방 참여자 수정" ON public.chat_rooms
  FOR UPDATE USING (
    auth.uid() = user_id
    OR auth.uid() IN (
      SELECT user_id FROM public.dealers WHERE id = dealer_id
    )
  );

-- ----------------------------------------------------------------
-- messages RLS — 채팅방 참여자만 읽기/쓰기
-- ----------------------------------------------------------------
CREATE POLICY "메시지 참여자 조회" ON public.messages
  FOR SELECT USING (
    room_id IN (
      SELECT id FROM public.chat_rooms
      WHERE user_id = auth.uid()
         OR dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "메시지 참여자 전송" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND room_id IN (
      SELECT id FROM public.chat_rooms
      WHERE user_id = auth.uid()
         OR dealer_id IN (SELECT id FROM public.dealers WHERE user_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------
-- notifications RLS — 본인 알림만 조회/수정
-- ----------------------------------------------------------------
CREATE POLICY "본인 알림 조회" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 알림 수정 (읽음 처리)" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
