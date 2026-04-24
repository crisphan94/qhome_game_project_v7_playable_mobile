extends Control

func _ready():
    $VBoxContainer/ResultLabel.text = GameManager.get_result_text()
    var total = GameManager.stats["tien_do"] + GameManager.stats["ngan_sach"] + GameManager.stats["chat_luong"] + GameManager.stats["hai_long"]
    if total >= 200:
        AudioManager.play_success()
    else:
        AudioManager.play_fail()
    $VBoxContainer/RestartButton.pressed.connect(_restart)
    $VBoxContainer/MenuButton.pressed.connect(_menu)

func _restart():
    AudioManager.play_click()
    GameManager.reset_game()
    GameManager.save_game()
    get_tree().change_scene_to_file("res://scenes/office.tscn")

func _menu():
    AudioManager.play_click()
    get_tree().change_scene_to_file("res://scenes/main_menu.tscn")
