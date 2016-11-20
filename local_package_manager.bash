#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$DIR/pacapt/lib/00_core.sh"

if _PACMAN_detect 1>/dev/null 2>/dev/null; then
    echo "$_PACMAN"
    exit 0
else
    exit 1
fi
