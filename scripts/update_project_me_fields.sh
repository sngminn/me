#!/bin/bash

PROJECT_ID="PVT_kwHOCABwHM4BJYZb"

# Field IDs
PRIORITY_FIELD="PVTSSF_lAHOCABwHM4BJYZbzg5j-BI"
SIZE_FIELD="PVTSSF_lAHOCABwHM4BJYZbzg5j-BM"
START_DATE_FIELD="PVTF_lAHOCABwHM4BJYZbzg5j-BU"
TARGET_DATE_FIELD="PVTF_lAHOCABwHM4BJYZbzg5j-BY"

# Option IDs
PRIORITY_P0="79628723"
PRIORITY_P1="0a877460"
SIZE_S="f784b110"
SIZE_M="7515a9f1"
SIZE_L="817d0097"

echo "🔄 Updating Project Fields for PROJECT(ME)..."

# Issue 28: Setup (P0, S, Dec 1-2)
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lac" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P0" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lac" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_S" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lac" --field-id "$START_DATE_FIELD" --date "2025-12-01" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lac" --field-id "$TARGET_DATE_FIELD" --date "2025-12-02" --project-id "$PROJECT_ID"

# Issue 29: Obsidian (P0, M, Dec 2-3)
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lag" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P0" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lag" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_M" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lag" --field-id "$START_DATE_FIELD" --date "2025-12-02" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lag" --field-id "$TARGET_DATE_FIELD" --date "2025-12-03" --project-id "$PROJECT_ID"

# Issue 30: Neural (P0, L, Dec 3-5)
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5law" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P0" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5law" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_L" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5law" --field-id "$START_DATE_FIELD" --date "2025-12-03" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5law" --field-id "$TARGET_DATE_FIELD" --date "2025-12-05" --project-id "$PROJECT_ID"

# Issue 31: Post UI (P1, M, Dec 4-6)
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5la4" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P1" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5la4" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_M" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5la4" --field-id "$START_DATE_FIELD" --date "2025-12-04" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5la4" --field-id "$TARGET_DATE_FIELD" --date "2025-12-06" --project-id "$PROJECT_ID"

# Issue 32: Deploy (P1, S, Dec 6-7)
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lbE" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P1" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lbE" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_S" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lbE" --field-id "$START_DATE_FIELD" --date "2025-12-06" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BJYZbzgh5lbE" --field-id "$TARGET_DATE_FIELD" --date "2025-12-07" --project-id "$PROJECT_ID"

echo "✅ Project fields updated successfully!"
