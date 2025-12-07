#!/bin/bash
set -e

PROJECT_ID="PVT_kwHOCABwHM4BEvb5"
OWNER="sngminn"

# Field IDs
PRIORITY_FIELD="PVTSSF_lAHOCABwHM4BEvb5zg2R8bs"
SIZE_FIELD="PVTSSF_lAHOCABwHM4BEvb5zg2R8bw"
START_DATE_FIELD="PVTF_lAHOCABwHM4BEvb5zg2R8b4"
END_DATE_FIELD="PVTF_lAHOCABwHM4BEvb5zg2R8b8"

# Option IDs
PRIORITY_P0="79628723"
PRIORITY_P1="0a877460"
SIZE_S="f784b110"
SIZE_M="7515a9f1"
SIZE_L="817d0097"

echo "🔄 Updating Project Fields..."

# Issue 28: Setup (P0, S, Dec 1-2)
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l2Q" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P0" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l2Q" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_S" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l2Q" --field-id "$START_DATE_FIELD" --date "2025-12-01" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l2Q" --field-id "$END_DATE_FIELD" --date "2025-12-02" --project-id "$PROJECT_ID"

# Issue 29: Obsidian (P0, M, Dec 2-3)
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l2c" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P0" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l2c" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_M" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l2c" --field-id "$START_DATE_FIELD" --date "2025-12-02" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l2c" --field-id "$END_DATE_FIELD" --date "2025-12-03" --project-id "$PROJECT_ID"

# Issue 30: Neural (P0, L, Dec 3-5)
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l24" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P0" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l24" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_L" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l24" --field-id "$START_DATE_FIELD" --date "2025-12-03" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l24" --field-id "$END_DATE_FIELD" --date "2025-12-05" --project-id "$PROJECT_ID"

# Issue 31: Post UI (P1, M, Dec 4-6)
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l3E" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P1" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l3E" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_M" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l3E" --field-id "$START_DATE_FIELD" --date "2025-12-04" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l3E" --field-id "$END_DATE_FIELD" --date "2025-12-06" --project-id "$PROJECT_ID"

# Issue 32: Deploy (P1, S, Dec 6-7)
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l3I" --field-id "$PRIORITY_FIELD" --single-select-option-id "$PRIORITY_P1" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l3I" --field-id "$SIZE_FIELD" --single-select-option-id "$SIZE_S" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l3I" --field-id "$START_DATE_FIELD" --date "2025-12-06" --project-id "$PROJECT_ID"
gh project item-edit --id "PVTI_lAHOCABwHM4BEvb5zgh5l3I" --field-id "$END_DATE_FIELD" --date "2025-12-07" --project-id "$PROJECT_ID"

echo "✅ Project fields updated successfully!"
