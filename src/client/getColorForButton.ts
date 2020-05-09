const typeClasses = {
    treasure:"warning",
    victory:"success",
    action:"secondary",
    reaction:"primary",
    ruins: "dark ruins-button-override",
    curse:"dark curse-button-override",
    duration:"dark duration-button-override",
    actionTreasure: "secondary action-treasure-button-override",
    actionVictory:"secondary action-victory-button-override",
    reactionShelter: "secondary reaction-shelter-button-override",
    actionShelter: "secondary action-shelter-button-override",
    victoryShelter: "secondary victory-shelter-button-override",
    night:'dark',
    nightDuration:'dark duration-night-button-override',
    project: 'dark project-button-override',
    artifact: 'dark artifact-button-override',
    way: 'warning way-button-override'
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
    if (types.indexOf('ruins') !== -1) {
        return typeClasses.ruins;
    }
    if(types.indexOf('night') !== -1 && types.indexOf('duration') !== -1 && types.length === 2) {
        return typeClasses.nightDuration;
    }
    if (types.indexOf('reaction') !== -1 && types.indexOf('shelter') !== -1 && types.length === 2) {
        return typeClasses.reactionShelter;
    }
    if (types.indexOf('shelter') !== -1 && types.indexOf('action') !== -1 && types.length === 2) {
        return typeClasses.actionShelter;
    }
    if (types.indexOf('shelter') !== -1 && types.indexOf('victory') !== -1 && types.length === 2) {
        return typeClasses.victoryShelter;
    }
    if (types.indexOf('action') !== -1 && types.indexOf('treasure') !== -1 && withoutNoColor.length === 2) {
        return typeClasses.actionTreasure;
    }
    return typeClasses[types[0]];
}