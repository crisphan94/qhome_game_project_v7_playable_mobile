extends Node2D

var in_range_npc := ""
var dialog_open := false
var choice_kind := ""
var dialogues = {
    "sale": ["Khách muốn thiết kế nhà phố hiện đại.", "Anh cần em chọn cách tư vấn phù hợp."],
    "architect": ["Anh đang lên phương án mặt bằng.", "Em chọn ưu tiên công năng hay tiết kiệm ngân sách?"]
}

func _ready():
    GameManager.current_scene_name = "office"
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
    if in_range_npc == "door_site" and GameManager.progress_step >= 2:
        GameManager.current_scene_name = "site"
        GameManager.save_game()
        get_tree().change_scene_to_file("res://scenes/site.tscn")
        return
    if in_range_npc == "sale" and GameManager.progress_step == 0:
        _show_dialog("sale")
        choice_kind = "sale"
    elif in_range_npc == "architect" and GameManager.progress_step == 1:
        _show_dialog("architect")
        choice_kind = "architect"

func _show_dialog(kind):
    var text = "\n".join(dialogues[kind]) + "\n\nNhấn Tương tác để chọn."
    $CanvasLayer/UI/DialogPanel/Label.text = text
    $CanvasLayer/UI/DialogPanel.visible = true
    dialog_open = true

func _show_choice(kind):
    var panel = $CanvasLayer/UI/ChoicePanel
    panel.visible = true
    if kind == "sale":
        panel.get_node("Question").text = "Chọn cách tư vấn"
        panel.get_node("AButton").text = "Lắng nghe kỹ nhu cầu"
        panel.get_node("BButton").text = "Chốt nhanh để giữ tiến độ"
    elif kind == "architect":
        panel.get_node("Question").text = "Chọn hướng mặt bằng"
        panel.get_node("AButton").text = "Ưu tiên công năng"
        panel.get_node("BButton").text = "Ưu tiên tiết kiệm"

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

func _on_sale_body_entered(body):
    if body.name == "Player":
        in_range_npc = "sale"
func _on_sale_body_exited(body):
    if body.name == "Player" and in_range_npc == "sale":
        in_range_npc = ""
func _on_architect_body_entered(body):
    if body.name == "Player":
        in_range_npc = "architect"
func _on_architect_body_exited(body):
    if body.name == "Player" and in_range_npc == "architect":
        in_range_npc = ""
func _on_door_body_entered(body):
    if body.name == "Player":
        in_range_npc = "door_site"
func _on_door_body_exited(body):
    if body.name == "Player" and in_range_npc == "door_site":
        in_range_npc = ""
