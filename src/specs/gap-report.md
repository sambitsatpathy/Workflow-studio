# Spec Gap Report
Generated: 2026-04-23T06:30:00.000Z
Schema version: v2
Repos in scope: frontend, backend

## Summary
| Severity | Count |
|----------|-------|
| High     | 0 |
| Medium   | 9 |
| Low      | 0 |
| Info     | 7 |
| **Total**| **16** |

## Pending cross-repo links
| Gap ID | From Node / Edge | Route | Repo |
|--------|------------------|-------|------|
| GAP-002 | GET /articles | Edge "GET /articles" targets an unresolved cross-repo node (GET /articles). | frontend |
| GAP-003 | POST /articles | Edge "POST /articles" targets an unresolved cross-repo node (POST /articles). | frontend |
| GAP-004 | GET /articles/:slug/comments | Edge "GET /articles/:slug/comments" targets an unresolved cross-repo node (GET /articles/:slug/comments). | frontend |
| GAP-005 | POST /users/login | Edge "POST /users/login" targets an unresolved cross-repo node (POST /users/login). | frontend |
| GAP-006 | POST /users | Edge "POST /users" targets an unresolved cross-repo node (POST /users). | frontend |
| GAP-007 | GET /user | Edge "GET /user" targets an unresolved cross-repo node (GET /user). | frontend |
| GAP-008 | GET /profiles/:username | Edge "GET /profiles/:username" targets an unresolved cross-repo node (GET /profiles/:username). | frontend |
| GAP-009 | GET /tags | Edge "GET /tags" targets an unresolved cross-repo node (GET /tags). | frontend |

## Medium severity gaps
- **GAP-001** `runtime-variable-value` node `backend-express-app` v1.0.0: Property "port" looks like an unresolved runtime variable: process.env.PORT|3000
  *Suggestion: Provide the actual value this resolves to in the target environment.*
- **GAP-002** `pending-link-unresolved` edge `edge-021`: Edge "GET /articles" targets an unresolved cross-repo node (GET /articles).
  *Suggestion: Run spec-merger with the target repo specs to resolve this cross-repo link.*
- **GAP-003** `pending-link-unresolved` edge `edge-022`: Edge "POST /articles" targets an unresolved cross-repo node (POST /articles).
  *Suggestion: Run spec-merger with the target repo specs to resolve this cross-repo link.*
- **GAP-004** `pending-link-unresolved` edge `edge-023`: Edge "GET /articles/:slug/comments" targets an unresolved cross-repo node (GET /articles/:slug/comments).
  *Suggestion: Run spec-merger with the target repo specs to resolve this cross-repo link.*
- **GAP-005** `pending-link-unresolved` edge `edge-010`: Edge "POST /users/login" targets an unresolved cross-repo node (POST /users/login).
  *Suggestion: Run spec-merger with the target repo specs to resolve this cross-repo link.*
- **GAP-006** `pending-link-unresolved` edge `edge-011`: Edge "POST /users" targets an unresolved cross-repo node (POST /users).
  *Suggestion: Run spec-merger with the target repo specs to resolve this cross-repo link.*
- **GAP-007** `pending-link-unresolved` edge `edge-012`: Edge "GET /user" targets an unresolved cross-repo node (GET /user).
  *Suggestion: Run spec-merger with the target repo specs to resolve this cross-repo link.*
- **GAP-008** `pending-link-unresolved` edge `edge-027`: Edge "GET /profiles/:username" targets an unresolved cross-repo node (GET /profiles/:username).
  *Suggestion: Run spec-merger with the target repo specs to resolve this cross-repo link.*
- **GAP-009** `pending-link-unresolved` edge `edge-028`: Edge "GET /tags" targets an unresolved cross-repo node (GET /tags).
  *Suggestion: Run spec-merger with the target repo specs to resolve this cross-repo link.*

## Info severity gaps
- **GAP-010** `workflow-refs-draft-version` workflow `backend-article-flow` v1.0.0: Version 1.0.0 references 8 node version(s) still in DRAFT.
  *Suggestion: No action now — workflow can be submitted once referenced nodes leave DRAFT.*
- **GAP-011** `workflow-refs-draft-version` workflow `backend-auth-flow` v1.0.0: Version 1.0.0 references 7 node version(s) still in DRAFT.
  *Suggestion: No action now — workflow can be submitted once referenced nodes leave DRAFT.*
- **GAP-012** `workflow-refs-draft-version` workflow `backend-profile-flow` v1.0.0: Version 1.0.0 references 6 node version(s) still in DRAFT.
  *Suggestion: No action now — workflow can be submitted once referenced nodes leave DRAFT.*
- **GAP-013** `workflow-refs-draft-version` workflow `backend-tag-flow` v1.0.0: Version 1.0.0 references 5 node version(s) still in DRAFT.
  *Suggestion: No action now — workflow can be submitted once referenced nodes leave DRAFT.*
- **GAP-014** `workflow-refs-draft-version` workflow `frontend-article-flow` v1.0.0: Version 1.0.0 references 7 node version(s) still in DRAFT.
  *Suggestion: No action now — workflow can be submitted once referenced nodes leave DRAFT.*
- **GAP-015** `workflow-refs-draft-version` workflow `frontend-auth-flow` v1.0.0: Version 1.0.0 references 8 node version(s) still in DRAFT.
  *Suggestion: No action now — workflow can be submitted once referenced nodes leave DRAFT.*
- **GAP-016** `workflow-refs-draft-version` workflow `frontend-profile-flow` v1.0.0: Version 1.0.0 references 4 node version(s) still in DRAFT.
  *Suggestion: No action now — workflow can be submitted once referenced nodes leave DRAFT.*

## How to respond
The application owner should annotate the `resolution` field on each item in `gap-report.json` and return it for spec-checker Step 6.
