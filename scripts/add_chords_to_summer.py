#!/usr/bin/env python3
"""
Summer (久石譲) のMusicXMLにコード記号を追加するスクリプト

コード進行を正しい拍位置に挿入する
- 1拍目のコード → 小節の最初のnote/forward/backupの直前
- 3拍目のコード → duration累積が24になった時点のnoteの直前
"""

import re
from typing import List, Tuple, Optional

# コード進行の定義（小節番号: [(拍位置, コード), ...]）
# 拍位置: 1=1拍目, 3=3拍目
chord_progression = {
    # イントロ（小節1-4）
    1: [(1, ("B", "minor")), (3, ("G", "major"))],
    2: [(1, ("A", "major")), (3, ("D", "major"))],
    3: [(1, ("B", "minor")), (3, ("G", "major"))],
    4: [(1, ("A", "major")), (3, ("D", "major"))],

    # Aセクション（小節5-20）
    5: [(1, ("B", "minor")), (3, ("G", "major"))],
    6: [(1, ("A", "major")), (3, ("D", "major"))],
    7: [(1, ("B", "minor")), (3, ("G", "major"))],
    8: [(1, ("A", "major")), (3, ("D", "major"))],
    9: [(1, ("B", "minor")), (3, ("G", "major"))],
    10: [(1, ("A", "major")), (3, ("D", "major"))],
    11: [(1, ("B", "minor")), (3, ("G", "major"))],
    12: [(1, ("A", "major")), (3, ("D", "major"))],
    13: [(1, ("B", "minor")), (3, ("G", "major"))],
    14: [(1, ("A", "major")), (3, ("D", "major"))],
    15: [(1, ("B", "minor")), (3, ("G", "major"))],
    16: [(1, ("A", "major")), (3, ("D", "major"))],
    17: [(1, ("B", "minor")), (3, ("G", "major"))],
    18: [(1, ("A", "major")), (3, ("D", "major"))],
    19: [(1, ("B", "minor")), (3, ("G", "major"))],
    20: [(1, ("A", "major")), (3, ("D", "major"))],

    # 転調部（小節21）
    21: [(1, ("D", "major")), (3, ("A", "major", "C#"))],

    # Bセクション（小節22-28、G majorに転調）
    22: [(1, ("G", "major"))],
    23: [(1, ("G", "major"))],
    24: [(1, ("E", "minor"))],
    25: [(1, ("E", "minor"))],
    26: [(1, ("C", "major"))],
    27: [(1, ("D", "major"))],
    28: [(1, ("G", "major")), (3, ("E", "minor"))],

    # A'セクション（小節29-48）
    29: [(1, ("F#", "minor")), (3, ("G", "major"))],
    30: [(1, ("B", "minor")), (3, ("G", "major"))],
    31: [(1, ("A", "major")), (3, ("D", "major"))],
    32: [(1, ("B", "minor")), (3, ("G", "major"))],
    33: [(1, ("A", "major")), (3, ("D", "major"))],
    34: [(1, ("B", "minor")), (3, ("G", "major"))],
    35: [(1, ("A", "major")), (3, ("D", "major"))],
    36: [(1, ("B", "minor")), (3, ("G", "major"))],
    37: [(1, ("A", "major")), (3, ("D", "major"))],
    38: [(1, ("B", "minor")), (3, ("G", "major"))],
    39: [(1, ("A", "major")), (3, ("D", "major"))],
    40: [(1, ("B", "minor")), (3, ("G", "major"))],
    41: [(1, ("A", "major")), (3, ("D", "major"))],
    42: [(1, ("B", "minor")), (3, ("G", "major"))],
    43: [(1, ("A", "major")), (3, ("D", "major"))],
    44: [(1, ("B", "minor")), (3, ("G", "major"))],
    45: [(1, ("A", "major")), (3, ("D", "major"))],
    46: [(1, ("B", "minor")), (3, ("G", "major"))],
    47: [(1, ("A", "major")), (3, ("D", "major"))],
    48: [(1, ("D", "major"))],
}


def create_harmony_xml(root_step: str, kind: str, bass_step: Optional[str] = None) -> str:
    """harmony要素のXMLを生成"""
    kind_map = {
        "major": "major",
        "minor": "minor",
        "dominant": "dominant",
    }
    kind_text = kind_map.get(kind, kind)

    # root-alterの処理
    root_alter_xml = ""
    if "#" in root_step:
        root_step_clean = root_step.replace("#", "")
        root_alter_xml = "\n        <root-alter>1</root-alter>"
    elif "b" in root_step:
        root_step_clean = root_step.replace("b", "")
        root_alter_xml = "\n        <root-alter>-1</root-alter>"
    else:
        root_step_clean = root_step

    # ベース音の処理
    bass_xml = ""
    if bass_step:
        bass_alter_xml = ""
        if "#" in bass_step:
            bass_step_clean = bass_step.replace("#", "")
            bass_alter_xml = "\n        <bass-alter>1</bass-alter>"
        else:
            bass_step_clean = bass_step
        bass_xml = f"""
      <bass>
        <bass-step>{bass_step_clean}</bass-step>{bass_alter_xml}
      </bass>"""

    return f"""      <harmony default-y="40">
        <root>
          <root-step>{root_step_clean}</root-step>{root_alter_xml}
        </root>
        <kind text="{kind_text}">{kind_text}</kind>{bass_xml}
      </harmony>
"""


def process_measure(measure_content: str, chords: List[Tuple]) -> str:
    """小節内のコードを正しい位置に挿入"""

    # 1拍目のコードを取得
    beat1_chord = None
    beat3_chord = None

    for beat, chord_info in chords:
        if beat == 1:
            beat1_chord = chord_info
        elif beat == 3:
            beat3_chord = chord_info

    # 3拍目のコードがある場合、duration累積が24になる位置を探す
    if beat3_chord:
        # voice 5（左手）のdurationを追跡して3拍目の位置を特定
        # divisions=12なので、3拍目 = duration 24経過後

        # noteタグの位置とdurationを解析
        note_pattern = re.compile(r'(<note[^>]*>.*?</note>)', re.DOTALL)
        duration_pattern = re.compile(r'<duration>(\d+)</duration>')
        chord_tag_pattern = re.compile(r'<chord/>')
        voice_pattern = re.compile(r'<voice>(\d+)</voice>')
        backup_pattern = re.compile(r'<backup>.*?<duration>(\d+)</duration>.*?</backup>', re.DOTALL)
        forward_pattern = re.compile(r'<forward>.*?<duration>(\d+)</duration>.*?</forward>', re.DOTALL)

        # 全体を順番に処理
        result = []
        current_pos = 0
        cumulative_duration = 0
        beat3_inserted = False
        voice5_started = False

        # 小節内を順番に処理
        i = 0
        while i < len(measure_content):
            # backupを探す
            backup_match = backup_pattern.match(measure_content, i)
            if backup_match:
                result.append(measure_content[current_pos:backup_match.end()])
                current_pos = backup_match.end()
                backup_dur = int(backup_match.group(1))
                cumulative_duration -= backup_dur
                if cumulative_duration < 0:
                    cumulative_duration = 0
                i = backup_match.end()
                voice5_started = True  # backupの後はvoice5
                continue

            # forwardを探す
            forward_match = forward_pattern.match(measure_content, i)
            if forward_match:
                result.append(measure_content[current_pos:forward_match.end()])
                current_pos = forward_match.end()
                forward_dur = int(forward_match.group(1))
                cumulative_duration += forward_dur
                i = forward_match.end()
                continue

            # noteを探す
            note_match = note_pattern.match(measure_content, i)
            if note_match:
                note_content = note_match.group(1)

                # chordタグがある場合は同時発音なのでdurationを加算しない
                is_chord = chord_tag_pattern.search(note_content)

                # voice番号を確認
                voice_match = voice_pattern.search(note_content)
                voice_num = int(voice_match.group(1)) if voice_match else 1

                # 3拍目（duration >= 24）でまだ挿入していない場合
                if not beat3_inserted and cumulative_duration >= 24 and not is_chord:
                    # このnoteの直前にharmonyを挿入
                    result.append(measure_content[current_pos:note_match.start()])

                    # harmony要素を生成
                    if len(beat3_chord) == 2:
                        root, kind = beat3_chord
                        bass = None
                    else:
                        root, kind, bass = beat3_chord
                    harmony_xml = create_harmony_xml(root, kind, bass)
                    result.append(harmony_xml)

                    current_pos = note_match.start()
                    beat3_inserted = True

                # durationを累積（chordタグがない場合のみ）
                if not is_chord:
                    dur_match = duration_pattern.search(note_content)
                    if dur_match:
                        cumulative_duration += int(dur_match.group(1))

                i = note_match.end()
                continue

            i += 1

        # 残りを追加
        result.append(measure_content[current_pos:])
        measure_content = ''.join(result)

    # 1拍目のコードを小節の先頭（measureタグの直後）に挿入
    if beat1_chord:
        # measureタグの終了位置を見つける
        measure_tag_end = measure_content.find('>') + 1

        if len(beat1_chord) == 2:
            root, kind = beat1_chord
            bass = None
        else:
            root, kind, bass = beat1_chord
        harmony_xml = create_harmony_xml(root, kind, bass)

        measure_content = (
            measure_content[:measure_tag_end] +
            "\n" + harmony_xml +
            measure_content[measure_tag_end:]
        )

    return measure_content


def add_chords_to_musicxml(input_file: str, output_file: str):
    """MusicXMLファイルにコードを追加"""
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 各小節を処理
    measure_pattern = re.compile(r'(<measure number="(\d+)"[^>]*>)(.*?)(</measure>)', re.DOTALL)

    def replace_measure(match):
        measure_start = match.group(1)
        measure_num = int(match.group(2))
        measure_body = match.group(3)
        measure_end = match.group(4)

        if measure_num in chord_progression:
            chords = chord_progression[measure_num]
            new_body = process_measure(measure_start + measure_body, chords)
            return new_body + measure_end
        else:
            return match.group(0)

    content = measure_pattern.sub(replace_measure, content)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Chords added successfully: {output_file}")


if __name__ == "__main__":
    import os

    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    input_file = os.path.join(project_root, "public/scores/summer-jiu-shi-rang.musicxml")
    output_file = os.path.join(project_root, "public/scores/summer-jiu-shi-rang-with-chords.musicxml")

    add_chords_to_musicxml(input_file, output_file)
