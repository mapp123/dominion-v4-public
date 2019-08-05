import * as React from 'react';
import {PlayerData} from "../createPlayerData";
interface IProps {
    playerData: PlayerData;
}
export default class DataViews extends React.Component<IProps, {}> {
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return this.props.playerData.dataViews.map((a) => {
            switch (a) {
                case "vp":
                    return (
                        <React.Fragment key={a}><span style={{fontFamily: "TrajanPro-Bold"}}>VP: {this.props.playerData.vp}</span><br /></React.Fragment>
                    );
                case "coffers":
                    return (
                        <React.Fragment key={a}><span style={{fontFamily: "TrajanPro-Bold"}}>Coffers: ${this.props.playerData.coffers}</span><br /></React.Fragment>
                    );
                case "villagers":
                    return (
                        <React.Fragment key={a}><span style={{fontFamily: "TrajanPro-Bold"}}>Villagers: ${this.props.playerData.villagers}</span><br /></React.Fragment>
                    );
            }
            return null;
        });
    }
}