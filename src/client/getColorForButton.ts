let typeClasses = {
    treasure:"warning",
    victory:"success",
    action:"secondary",
    reaction:"primary",
    curse:"dark curse-button-override",
    duration:"dark duration-button-override",
    actionVictory:"secondary action-victory-button-override",
    night:'dark',
    nightDuration:'dark duration-night-button-override',
    project: 'dark project-button-override'
};
export default function getColorForButton(types: readonly string[]) {
    if(types.length === 0) return "info";
    if(types.indexOf('action') !== -1 && types.indexOf('duration') !== -1 && types.length === 2) {
        return typeClasses.duration;
    }
    if(types.indexOf('action') !== -1 && types.indexOf('victory') !== -1 && types.length === 2) {
        return typeClasses.actionVictory;
    }
    if(types.indexOf('night') !== -1 && types.indexOf('duration') !== -1 && types.length === 2) {
        return typeClasses.nightDuration;
    }
    return typeClasses[types[0]];
}