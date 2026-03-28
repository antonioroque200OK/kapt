---
title: "Selfie Capture & LGPD Opt-In Flow"
description: "Spec for the SelfieCapture modal: camera access, selfie capture, LGPD biometric consent (Global vs. Event-specific), and submission to the Identification Engine."
type: "ux"
epic: "seeker"
status: "approved"
related_issues: ["25"]
---

# UX Spec: Selfie Capture & LGPD Opt-In Flow

## 1. Context & Objective

After OTP authentication, the `seeker` must provide a selfie and give explicit LGPD biometric
consent before the Identification Engine can match their photos. This modal appears immediately
after `handleAuthSuccess` closes the `OTPModal`.

---

## 2. Component: `SelfieCapture`

Follows the same modal pattern as `OTPModal` — centered overlay, `rounded-card`, actionVolt
tokens, all copy in PT-BR.

### Props

```ts
interface SelfieCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // fires after successful submission
}
```

---

## 3. Step Machine

```
camera → consent → (submitting) → success | error
```

| Step | Description |
|---|---|
| `camera` | Request `getUserMedia` permission → live `<video>` preview → "Tirar foto" CTA |
| `consent` | Show captured thumbnail + LGPD opt-in toggles + "Confirmar" CTA |
| `submitting` | Spinner while POSTing to `/identification/selfie` |
| `success` | Volt checkmark + "Fotos sendo buscadas!" → calls `onSuccess` after 1s |
| `error` | PT-BR error message + retry option |

### Camera Permission Denied
If `getUserMedia` throws a `NotAllowedError`, display a static error state:
- Icon: camera crossed out
- Copy: **"Permissão de câmera negada. Habilite o acesso nas configurações do seu navegador."**
- No retry loop — user must fix browser settings manually.

---

## 4. LGPD Consent Options

| Type | `consent_type` value | Benefit shown to user |
|---|---|---|
| Global | `global` | "Ganhe sua 1ª foto grátis no próximo evento" |
| Evento-específico | `event` | "Apenas para esta cobertura" |

Default selection: **Global** (maximises opt-in rate per business rules).

---

## 5. API Integration

### New function in `src/lib/api.ts`

```ts
submitSelfie(blob: Blob, consentType: 'global' | 'event', token: string): Promise<void>
```

**Request:**
```
POST /identification/selfie
Authorization: Bearer <token>
Content-Type: multipart/form-data

selfie: <image blob>
consent_type: 'global' | 'event'
```

**Responses:**
- `200` → success
- `401` → token expired, show PT-BR error
- `5xx` → generic PT-BR error

---

## 6. Files Changed

| File | Action |
|---|---|
| `apps/web/src/components/SelfieCapture.tsx` | New component |
| `apps/web/src/components/SelfieCapture.test.tsx` | Tests |
| `apps/web/src/lib/api.ts` | Add `submitSelfie()` |
| `apps/web/app/page.tsx` | Open `SelfieCapture` after OTP success |

---

## 7. Test Coverage

- Camera permission denied → shows PT-BR error state
- Successful capture → advances to consent step
- Consent toggle switches between Global and Evento-específico
- Submit calls `submitSelfie` with correct args
- Success state calls `onSuccess`
- API error shows PT-BR error message

---

## 8. Success Criteria

- `seeker` can capture a selfie via browser camera on mobile and desktop.
- LGPD consent is explicitly recorded before any POST is made.
- All copy is in PT-BR.
- All test cases pass (`npm test` in `apps/web`).
