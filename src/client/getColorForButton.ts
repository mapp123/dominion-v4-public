let typeClasses = {
    treasure:"warning",
    victory:"success",
    action:"secondary",
    reaction:"primary",
    curse:"dark curse-button-override",
    duration:"dark duration-button-override",
    actionTreasure: "secondary action-treasure-button-override",
    actionVictory:"secondary action-victory-button-override",
    night:'dark',
    nightDuration:'dark duration-night-button-override',
    project: 'dark project-button-override',
    artifact: 'dark artifact-button-override'
};
const noColor = ['attack'];
export default function getColorForButton(types: readonly string[]) {
    if(types.length === 0) return "info";
    const withoutNoColor = types.filter((a) => !noColor.includes(a));
    if(types.indexOf('action') !== -1 && types.indexOf('duration') !== -1 && types.length === 2) {
        return typeClasses.duration;
    }
    if(types.indexOf('action') !== -1 && types.indexOf('victory') !== -1 && types.length === 2) {
        return typeClasses.actionVictory;
    }
    if(types.indexOf('night') !== -1 && types.indexOf('duration') !== -1 && types.length === 2) {
        return typeClasses.nightDuration;
    }
    if (types.indexOf('action') !== -1 && types.indexOf('treasure') !== -1 && withoutNoColor.length === 2) {
        return typeClasses.actionTreasure;
    }
    return typeClasses[types[0]];
}