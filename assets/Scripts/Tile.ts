import { _decorator, Component, Label, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {
    @property(Label)
    public label: Label = null;

    public value: number = 0;

    updateDisplay() {
        this.label.string = this.value === 0 ? "" : this.value.toString();
    }

    setValue(value: number) {
        this.value = value;
        this.updateDisplay();
    }
}
