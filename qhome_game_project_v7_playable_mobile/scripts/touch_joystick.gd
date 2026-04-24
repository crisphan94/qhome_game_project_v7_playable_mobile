extends Control

@export var radius := 90.0
var output := Vector2.ZERO
var dragging := false

func _ready():
    $Knob.position = $Base.position + Vector2(30, 30)

func get_output() -> Vector2:
    return output

func _gui_input(event):
    if event is InputEventScreenTouch:
        if event.pressed:
            dragging = true
            _set_knob(event.position)
        else:
            dragging = false
            output = Vector2.ZERO
            $Knob.position = $Base.position + Vector2(30, 30)
    elif event is InputEventScreenDrag and dragging:
        _set_knob(event.position)

func _set_knob(pos: Vector2):
    var center = $Base.global_position + $Base.size / 2
    var delta = pos - center
    if delta.length() > radius:
        delta = delta.normalized() * radius
    output = delta / radius
    $Knob.global_position = center + delta - $Knob.size / 2
