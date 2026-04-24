extends CharacterBody2D

@export var speed := 260.0
@export var joystick_path: NodePath
var joystick

func _ready():
    if joystick_path != NodePath():
        joystick = get_node_or_null(joystick_path)

func _physics_process(_delta):
    var input_vec = Vector2.ZERO
    input_vec.x = Input.get_action_strength("move_right") - Input.get_action_strength("move_left")
    input_vec.y = Input.get_action_strength("move_down") - Input.get_action_strength("move_up")
    if joystick and joystick.has_method("get_output"):
        var j = joystick.get_output()
        if j.length() > 0.05:
            input_vec = j
    input_vec = input_vec.normalized()
    velocity = input_vec * speed
    move_and_slide()
