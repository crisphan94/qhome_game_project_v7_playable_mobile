extends Node2D

var in_range_npc := ""
var dialog_open := false
var choice_kind := ""
var dialogues = {
    "engineer": ["Ngoài công trường có lỗi trần thạch cao.", "Em chọn xử lý chuẩn hay xử lý nhanh?"]
}

func _ready():
    GameManager.current_scene_name = "site"
    $CanvasLayer/UI/QuestLabel.text = "Nhiệm vụ: " + GameManager.get_current_quest()
    _update_stats()
    $CanvasLayer/UI/ChoicePanel.visible = false
    $CanvasLayer/UI/DialogPanel.visible = false
    $CanvasLayer/UI/InteractButton.pressed.connect(_on_interact_button)
    $CanvasLayer/UI/ChoicePanel/AButton.pressed.connect(func(): _choose("A"))
    $CanvasLayer/UI/ChoicePanel/BButton.pressed.connect(func(): _choose("B"))

func _process(_delta):
    if Input.is_action_just_pressed("interact"):
        _interact()

func _on_interact_button():
    _interact()

func _interact():
    if dialog_open:
        $CanvasLayer/UI/DialogPanel.visible = false
        dialog_open = false
        if choice_kind != "":
            _show_choice(choice_kind)
        return
    if in_range_npc == "":
        return
    AudioManager.play_interact()
    if in_range_npc == "engineer" and GameManager.progress_step == 2:
        _show_dialog("engineer")
        choice_kind = "engineer"
    elif in_range_npc == "result_door" and GameManager.progress_step >= 3:
        GameManager.current_scene_name = "result"
        GameManager.save_game()
        get_tree().change_scene_to_file("res://scenes/result.tscn")

func _show_dialog(kind):
    $CanvasLayer/UI/DialogPanel/Label.text = "\n".join(dialogues[kind]) + "\n\nNhấn Tương tác để chọn."
    $CanvasLayer/UI/DialogPanel.visible = true
    dialog_open = true

func _show_choice(kind):
    var panel = $CanvasLayer/UI/ChoicePanel
    panel.visible = true
    panel.get_node("Question").text = "Chọn cách xử lý hiện trường"
    panel.get_node("AButton").text = "Sửa đúng quy trình"
    panel.get_node("BButton").text = "Vá nhanh để kịp tiến độ"

func _choose(option):
    $CanvasLayer/UI/ChoicePanel.visible = false
    GameManager.apply_choice(choice_kind, option)
    GameManager.next_step()
    GameManager.save_game()
    choice_kind = ""
    $CanvasLayer/UI/QuestLabel.text = "Nhiệm vụ: " + GameManager.get_current_quest()
    _update_stats()
    AudioManager.play_click()

func _update_stats():
    var s = GameManager.stats
    $CanvasLayer/UI/StatsLabel.text = "Tiến độ %d | Ngân sách %d | Chất lượng %d | Hài lòng %d" % [s["tien_do"], s["ngan_sach"], s["chat_luong"], s["hai_long"]]

func _on_engineer_body_entered(body):
    if body.name == "Player":
        in_range_npc = "engineer"
func _on_engineer_body_exited(body):
    if body.name == "Player" and in_range_npc == "engineer":
        in_range_npc = ""
func _on_result_body_entered(body):
    if body.name == "Player":
        in_range_npc = "result_door"
func _on_result_body_exited(body):
    if body.name == "Player" and in_range_npc == "result_door":
        in_range_npc = ""
