extends Control

func _ready():
    $VBoxContainer/NewGameButton.pressed.connect(_new_game)
    $VBoxContainer/ContinueButton.pressed.connect(_continue_game)
    $VBoxContainer/ExitButton.pressed.connect(func(): get_tree().quit())

func _new_game():
    AudioManager.play_click()
    GameManager.reset_game()
    GameManager.save_game()
    get_tree().change_scene_to_file("res://scenes/office.tscn")

func _continue_game():
    AudioManager.play_click()
    if GameManager.load_game():
        match GameManager.current_scene_name:
            "site":
                get_tree().change_scene_to_file("res://scenes/site.tscn")
            "result":
                get_tree().change_scene_to_file("res://scenes/result.tscn")
            _:
                get_tree().change_scene_to_file("res://scenes/office.tscn")
    else:
        _new_game()
