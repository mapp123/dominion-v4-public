import Project from "../Project";
import Player from "../../server/Player";
import {Texts} from "../../server/Texts";

export default class SinisterPlot extends Project {
    cardArt = "/img/card-img/Sinister_PlotArt.jpg";
    cardText = "At the start of your turn, add a token here, or remove your tokens here to draw that many cards.";
    intrinsicCost = {
        coin: 4
    };
    name = "sinister plot";
    async onPlayerJoinProject(player: Player): Promise<any> {
        let tokens = 0;
        player.effects.setupEffect('turnStart', 'sinister plot', {
            compatibility: {}
        }, async () => {
            const option = await player.chooseOption(Texts.chooseBenefitFor('sinister plot'), [Texts.addTokenTo('sinister plot'), Texts.drawXCards(tokens.toString())]);
            switch (option) {
                case Texts.addTokenTo('sinister plot'):
                    player.lm('%p adds a token to their sinister plot.');
                    tokens++;
                    break;
                case Texts.drawXCards(tokens.toString()):
                    player.lm('%p removes %s token%s from their sinister plot, drawing %s card%s.', tokens, tokens === 1 ? '' : 's', tokens, tokens === 1 ? '' : 's');
                    await player.draw(tokens);
                    tokens = 0;
                    break;
            }
        });
    }
}