#!/bin/bash

# バックアップスクリプト
# 使用方法: ./backup.sh

# タイムスタンプ生成
timestamp=$(date +"%Y%m%d_%H%M%S")
backup_dir="backup/backup_${timestamp}"

# バックアップディレクトリ作成
mkdir -p "${backup_dir}"

# 重要なファイルをバックアップ
files_to_backup=(
    "index.html"
    "styles.css"
    "script.js"
    "three-animation.js"
    "horror-effects.css"
    "horror-interactions.js"
    "logo-styles.css"
    "logo-interactions.js"
    "compatibility-fixes.js"
)

# ファイルをコピー
for file in "${files_to_backup[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "${backup_dir}/"
        echo "バックアップ: $file -> ${backup_dir}/$file"
    fi
done

# ロゴファイルもバックアップ
for logo in *.png; do
    if [ -f "$logo" ]; then
        cp "$logo" "${backup_dir}/"
        echo "バックアップ: $logo -> ${backup_dir}/$logo"
    fi
done

echo "バックアップ完了: ${backup_dir}"

# 古いバックアップを削除（最新10個を保持）
backup_count=$(ls -1d backup/backup_* 2>/dev/null | wc -l)
if [ $backup_count -gt 10 ]; then
    ls -1dt backup/backup_* | tail -n +11 | xargs rm -rf
    echo "古いバックアップを削除しました"
fi