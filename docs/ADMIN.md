# Admin System Design

## Overview
Admin이 수동으로 게임 라운드를 관리하고, 사용자를 모니터링하며, 부적절한 콘텐츠를 제재하는 시스템

---

## Admin 권한 구조

### 권한 레벨

```
super_admin (최고 관리자)
  ├── Admin 계정 생성/삭제
  ├── 라운드 관리 (생성/시작/종료/취소)
  ├── 사용자 관리 (제재/해제)
  ├── 콘텐츠 관리 (프롬프트 삭제)
  ├── 통계 조회
  └── Audit Log 조회

admin (일반 관리자)
  ├── 라운드 관리 (시작/종료)
  ├── 사용자 관리 (제재/해제)
  ├── 콘텐츠 관리 (프롬프트 삭제)
  └── 통계 조회

moderator (중재자)
  ├── 콘텐츠 관리 (프롬프트 삭제)
  └── 통계 조회
```

### Permissions JSONB 구조

```json
{
  "rounds": true,       // 라운드 관리
  "users": true,        // 사용자 관리
  "stats": true,        // 통계 조회
  "prompts": true,      // 프롬프트 삭제
  "admin_manage": true  // Admin 계정 관리 (super_admin만)
}
```

---

## Admin 인증 흐름

### Edge Function에서 Admin 확인

```typescript
// _shared/adminAuth.ts
export async function verifyAdmin(req: Request, requiredPermission?: string) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. JWT 검증
  const { data: { user } } = await supabase.auth.getUser(token)
  if (!user) return { error: 'Unauthorized', status: 401 }

  // 2. Admin 확인
  const { data: admin } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (!admin) return { error: 'Admin permission required', status: 403 }

  // 3. 특정 권한 확인
  if (requiredPermission && !admin.permissions[requiredPermission]) {
    return { error: `No ${requiredPermission} permission`, status: 403 }
  }

  return { error: null, admin, supabase }
}
```

**사용 예시:**
```typescript
serve(async (req) => {
  const { error, admin, supabase } = await verifyAdmin(req, 'rounds')
  if (error) return new Response(JSON.stringify({ error }), { status })

  // 비즈니스 로직...
})
```

---

## 라운드 관리 워크플로우

### 1. 라운드 생성 (scheduled)
Admin이 미리 라운드를 예약 생성

### 2. 라운드 시작 (active)
- Admin이 수동으로 시작
- `is_active = true`, `status = 'active'`
- `started_by` 기록

### 3. 라운드 종료 (completed)
- Admin이 수동으로 종료
- `is_active = false`, `status = 'completed'`
- **리더보드 스냅샷 자동 생성**
- `ended_by` 기록

### 4. 라운드 연장
- `end_time` 업데이트 (예: +30분)

### 5. 라운드 취소
- `status = 'cancelled'`

---

## 프롬프트 삭제 로직

### 소프트 삭제 + 점수 롤백

1. `prompt_history.is_deleted = true`
2. `deleted_by`, `delete_reason` 기록
3. `characters` 테이블에서 점수 롤백
   - `strength -= strength_gained`
   - `charm -= charm_gained`
   - `creativity -= creativity_gained`
   - `total_score -= total_score_gained`
4. `admin_audit_log` 기록

---

## 사용자 제재

### Ban
- `characters.is_active = false`
- 캐릭터 비활성화 (프롬프트 제출 불가)
- `admin_audit_log` 기록

### Unban
- `characters.is_active = true`

---

## Audit Log

### 기록해야 할 Admin 행동

- `START_ROUND`: 라운드 시작
- `END_ROUND`: 라운드 종료
- `CREATE_ROUND`: 라운드 생성
- `EXTEND_ROUND`: 라운드 연장
- `CANCEL_ROUND`: 라운드 취소
- `DELETE_PROMPT`: 프롬프트 삭제
- `BAN_USER`: 사용자 제재
- `UNBAN_USER`: 제재 해제

### Log 구조
```json
{
  "admin_id": "uuid",
  "action": "START_ROUND",
  "resource_type": "game_rounds",
  "resource_id": "uuid",
  "changes": {
    "status": "scheduled -> active"
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

---

## Admin Panel UI 구조

### 1. Dashboard
- 현재 라운드 상태 (실시간)
- 통계 카드 (사용자 수, 프롬프트 수, 라운드 수)
- 최근 활동 로그

### 2. Round Management
- 라운드 생성 폼
- 예정된 라운드 목록
- 현재 활성 라운드 (시작/종료/연장 버튼)
- 과거 라운드 히스토리

### 3. Prompt Moderation
- 프롬프트 목록 (필터링, 검색)
- 삭제 버튼 + 사유 입력
- 점수 롤백 확인

### 4. User Management
- 사용자 검색
- 사용자 상세 정보 (캐릭터, 통계)
- 제재/해제 버튼

### 5. Statistics
- Ant Design Statistic 컴포넌트 사용
- 라운드별, 사용자별 통계

### 6. Audit Log
- Admin 행동 로그 테이블
- 필터링 (액션, Admin, 날짜)

---

## Security

### 1. Admin 계정 생성
- super_admin만 새 Admin 생성 가능
- 초기 super_admin은 DB에 직접 INSERT

### 2. Audit Log 필수
- 모든 Admin 행동 기록
- IP 주소, User-Agent 저장
- 변경 전/후 데이터 JSONB 저장

### 3. Rate Limiting
- Admin API도 Rate Limit 적용
- 특히 삭제/제재 API는 엄격하게

---

## FAQ

**Q: 라운드를 자동으로 시작할 수 없나요?**
A: Admin이 수동으로 시작해야 합니다. 서버 상태 확인 후 진행하기 위함입니다.

**Q: 프롬프트 삭제 시 점수도 자동 롤백되나요?**
A: 네, Edge Function에서 자동으로 점수 차감합니다.

**Q: Admin이 실수로 라운드를 조기 종료하면?**
A: Audit Log에 기록되므로 추적 가능하며, 수동 복구가 필요합니다.
