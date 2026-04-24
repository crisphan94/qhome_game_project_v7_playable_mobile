extends Node

var click_sfx: AudioStreamPlayer
var interact_sfx: AudioStreamPlayer
var success_sfx: AudioStreamPlayer
var fail_sfx: AudioStreamPlayer

func _ready():
    click_sfx = AudioStreamPlayer.new()
    click_sfx.stream = load("res://assets/audio/click.wav")
    add_child(click_sfx)

    interact_sfx = AudioStreamPlayer.new()
    interact_sfx.stream = load("res://assets/audio/interact.wav")
    add_child(interact_sfx)

    success_sfx = AudioStreamPlayer.new()
    success_sfx.stream = load("res://assets/audio/success.wav")
    add_child(success_sfx)

    fail_sfx = AudioStreamPlayer.new()
    fail_sfx.stream = load("res://assets/audio/fail.wav")
    add_child(fail_sfx)

func play_click():
    click_sfx.play()

func play_interact():
    interact_sfx.play()

func play_success():
    success_sfx.play()

func play_fail():
    fail_sfx.play()
