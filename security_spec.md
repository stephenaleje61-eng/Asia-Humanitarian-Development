# Security Specification & Threat Model

## 1. Data Invariants & Authorization Boundaries

1. **User Profiles (`/users/{userId}`)**:
   - Only authenticated users can write their own profile (`request.auth.uid == userId`).
   - Normal users cannot escalate their role to `admin` (`incoming().role == 'member' || isAdmin()`).
   - Immutable fields: `uid`, `createdAt`.
   - Read access: Owner can read their profile, Admins can read all profiles to manage volunteers and conversations.

2. **Administrators (`/administrators/{adminId}`)**:
   - Bootstrapped admin verification: `request.auth.token.email == 'johnlsacc23332@gmail.com'` or doc in `/administrators/{uid}`.
   - Normal users have zero read or write access.

3. **Conversations (`/conversations/{conversationId}`)**:
   - Access is strictly gated: only the conversation's `userId` (`request.auth.uid == resource.data.userId`) or `isAdmin()` can read or write.
   - On creation: `incoming().userId == request.auth.uid || isAdmin()`.
   - No user can read or modify another member's conversation.

4. **Messages (`/conversations/{conversationId}/messages/{messageId}`)**:
   - Master Gate invariant: Messages are sub-collections of conversations. The user must be the conversation's participant (`get(/databases/$(database)/documents/conversations/$(conversationId)).data.userId == request.auth.uid`) or `isAdmin()`.
   - Message author must be `request.auth.uid`.
   - Immutable fields: `conversationId`, `senderId`, `createdAt`.

5. **Volunteer Applications (`/volunteer_applications/{applicationId}`)**:
   - Anyone authenticated or submitting application can create (`create`).
   - Only applicant (`resource.data.userId == request.auth.uid`) or `isAdmin()` can read.
   - Status transitions (e.g. `pending` -> `reviewed` -> `accepted`) are restricted to `isAdmin()`.

6. **Partnership Requests & Contact Enquiries**:
   - Create is open for submissions with strict length/type validation.
   - Read, update, and delete are strictly restricted to `isAdmin()`.

7. **Programmes & Announcements**:
   - Read is public (`allow read: if true;`) so visitors, communities, and donors can read humanitarian work.
   - Create, update, delete are strictly restricted to `isAdmin()`.

---

## 2. The "Dirty Dozen" Adversarial Payloads (Must Be Rejected)

1. **Adversarial Payload 1 (Identity Spoofing - Impersonating User ID)**:
   - Attempt to write `/users/target_victim_123` with `{ uid: "target_victim_123", role: "member" }` while authenticated as attacker `bad_actor_999`.
   - *Result*: PERMISSION_DENIED.

2. **Adversarial Payload 2 (Privilege Escalation - Self-Promotion to Admin)**:
   - Member attempts to update `/users/my_id` with `{ role: "admin" }`.
   - *Result*: PERMISSION_DENIED.

3. **Adversarial Payload 3 (Snoop Attack - Eavesdropping on Another User's Conversation)**:
   - User `alice` queries or reads `/conversations/bob_admin_conv`.
   - *Result*: PERMISSION_DENIED.

4. **Adversarial Payload 4 (Orphan Message Injection)**:
   - User attempts to inject a message into `/conversations/other_conv/messages/msg_1` where `other_conv` belongs to someone else.
   - *Result*: PERMISSION_DENIED.

5. **Adversarial Payload 5 (Denial of Wallet - 2MB String in Message Text)**:
   - Attempt to send message with 2MB payload string exceeding `maxLength: 3000`.
   - *Result*: PERMISSION_DENIED.

6. **Adversarial Payload 6 (Forged Server Timestamp)**:
   - Client sends fake past/future timestamp `createdAt: "1999-01-01"` instead of server timestamp `request.time`.
   - *Result*: PERMISSION_DENIED.

7. **Adversarial Payload 7 (Shadow Fields in Volunteer Application)**:
   - Submitting volunteer application with unauthorized field `{ isApproved: true, bypassReview: true }`.
   - *Result*: PERMISSION_DENIED via `hasOnly()` keys gate.

8. **Adversarial Payload 8 (Public Access to Private Enquiries)**:
   - Unauthenticated or non-admin member queries `/contact_enquiries`.
   - *Result*: PERMISSION_DENIED.

9. **Adversarial Payload 9 (Tampering with Programme Details as Member)**:
   - Non-admin user attempts `setDoc` or `updateDoc` on `/programmes/prog_healthcare`.
   - *Result*: PERMISSION_DENIED.

10. **Adversarial Payload 10 (Direct Modification of Admin Role List)**:
    - Member writes to `/administrators/my_uid`.
    - *Result*: PERMISSION_DENIED.

11. **Adversarial Payload 11 (ID Traversal / Special Characters Poisoning)**:
    - Creating a conversation with path `../admin_trap/..` or invalid ID characters.
    - *Result*: PERMISSION_DENIED via `isValidId()`.

12. **Adversarial Payload 12 (Altering Immutable Message Sender)**:
    - Sender tries to update existing message to point `senderId` to another user.
    - *Result*: PERMISSION_DENIED.
