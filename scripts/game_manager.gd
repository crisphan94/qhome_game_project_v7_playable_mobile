extends Node

const SAVE_PATH := "user://save_game.json"

var current_scene_name := "office"
var current_day := 1
var progress_step := 0
var player_name := "Quản lý tập sự"

var stats := {
    "tien_do": 50,
    "ngan_sach": 50,
    "chat_luong": 50,
    "hai_long": 50
}

var quest_texts := [
    "Gặp Sale để nhận brief khách hàng tại Q-Home.",
    "Gặp Kiến trúc sư để chốt mặt bằng sơ bộ.",
    "Ra công trường gặp Kỹ sư hiện trường.",
    "Hoàn thành ngày làm việc và xem kết quả dự án."
]

func reset_game():
    current_scene_name = "office"
    current_day = 1
    progress_step = 0
    stats = {"tien_do": 50, "ngan_sach": 50, "chat_luong": 50, "hai_long": 50}

func get_current_quest() -> String:
    if progress_step >= 0 and progress_step < quest_texts.size():
        return quest_texts[progress_step]
    return "Đã hoàn thành nhiệm vụ hôm nay."

func apply_choice(kind: String, option: String):
    match kind:
        "sale":
            if option == "A":
                stats["hai_long"] += 8
                stats["ngan_sach"] -= 2
            else:
                stats["tien_do"] += 5
                stats["hai_long"] -= 5
        "architect":
            if option == "A":
                stats["chat_luong"] += 10
                stats["hai_long"] += 5
            else:
                stats["ngan_sach"] += 8
                stats["chat_luong"] -= 8
        "engineer":
            if option == "A":
                stats["chat_luong"] += 8
                stats["tien_do"] -= 5
            else:
                stats["tien_do"] += 10
                stats["chat_luong"] -= 10
    for k in stats.keys():
        stats[k] = clamp(stats[k], 0, 100)

func next_step():
    progress_step += 1

func get_result_text() -> String:
    var total = stats["tien_do"] + stats["ngan_sach"] + stats["chat_luong"] + stats["hai_long"]
    if total >= 260:
        return "THÀNH CÔNG LỚN\nQ-Home chốt dự án rất tốt."
    elif total >= 200:
        return "TẠM ỔN\nDự án chạy được nhưng còn điểm cần cải thiện."
    return "THẤT BẠI\nDự án phát sinh nhiều vấn đề, cần làm lại kế hoạch."

func save_game():
    var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file:
        file.store_string(JSON.stringify({
            "current_scene_name": current_scene_name,
            "current_day": current_day,
            "progress_step": progress_step,
            "stats": stats
        }))
        file.close()

func load_game() -> bool:
    if not FileAccess.file_exists(SAVE_PATH):
        return false
    var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
    if not file:
        return false
    var txt = file.get_as_text()
    file.close()
    var parser = JSON.new()
    if parser.parse(txt) != OK:
        return false
    var d = parser.data
    current_scene_name = d.get("current_scene_name", "office")
    current_day = d.get("current_day", 1)
    progress_step = d.get("progress_step", 0)
    stats = d.get("stats", stats)
    return true
