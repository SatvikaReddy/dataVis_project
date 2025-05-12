#!/usr/bin/env bash
set -e

# 1) Download the large stats_data.csv with the confirm token
FILEID=1Cp9E_0M8o4vsORETK9hRx86BI4lq6fgM
curl -c /tmp/gcookie -s "https://drive.google.com/uc?export=download&id=${FILEID}" \
  | sed -En 's/.*confirm=([0-9A-Za-z_]+).*/\1/p' > /tmp/gconfirm
CONFIRM=$(< /tmp/gconfirm)
curl -Lb /tmp/gcookie \
  "https://drive.google.com/uc?export=download&confirm=${CONFIRM}&id=${FILEID}" \
  -o public/stats_data.csv

# 2) The other three files (under 100 MB) can be fetched directly:
curl -L "https://drive.google.com/uc?export=download&id=1l2WPDbMFdRMHzOBN5U7QW4dBtq18OEng" \
  -o public/bar_chart_data.csv

curl -L "https://drive.google.com/uc?export=download&id=1vSUYebnXxIRbDGN2LwkAfbTpdNPik1T_" \
  -o public/bubble_chart_data.csv

curl -L "https://drive.google.com/uc?export=download&id=1tmkxdYTdjPR1Lf4dWqchM_cc9gvnOw_S" \
  -o public/radar_data.csv
# https://drive.google.com/file/d/1nCLIIVKVJ-S61WfB4DjnVt6tfmoZ3Yqe/view?usp=sharing
# clean up temp files
# https://drive.google.com/file/d/1vSUYebnXxIRbDGN2LwkAfbTpdNPik1T_/view?usp=sharing
rm -f /tmp/gcookie /tmp/gconfirm
