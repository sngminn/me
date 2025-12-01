#!/bin/bash
set -e

echo "🔄 Updating Issues..."

# Issue 28
gh issue edit 28 --title "프로젝트 초기 세팅 (Project Initialization)" --add-assignee "@me"
# Issue 29
gh issue edit 29 --title "옵시디언 파이프라인 구축 (Obsidian Pipeline)" --add-assignee "@me"
# Issue 30
gh issue edit 30 --title "신경망 네비게이션 구현 (Neural Navigation)" --add-assignee "@me"
# Issue 31
gh issue edit 31 --title "포스트 상세 페이지 & UI (Post Detail & UI)" --add-assignee "@me"
# Issue 32
gh issue edit 32 --title "배포 및 검증 (Deploy & Verify)" --add-assignee "@me"

echo "✅ Issues updated successfully!"
