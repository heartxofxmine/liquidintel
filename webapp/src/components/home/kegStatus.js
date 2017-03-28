import React from 'react';

import {
    Row,
    Col,
    Grid,
    Panel,
    Label,
    Badge,
    PanelBody,
    PanelHeader,
    FormControl,
    PanelContainer,
} from '@sketchpixy/rubix';

export default class KegStatus extends React.Component {
    constructor(props) {
        super(props);
    }
    drawKnobs() {
        $('.dial').knob();
        $('.knob').knob({
            draw: function () {
                // 'tron' case
                if (this.$.data('skin') == 'tron') {
                    var a = this.angle(this.cv)  // Angle
                        , sa = this.startAngle          // Previous start angle
                        , sat = this.startAngle         // Start angle
                        , ea                            // Previous end angle
                        , eat = sat + a                 // End angle
                        , r = true;

                    this.g.lineWidth = this.lineWidth;

                    this.o.cursor
                        && (sat = eat - 0.3)
                        && (eat = eat + 0.3);

                    if (this.o.displayPrevious) {
                        ea = this.startAngle + this.angle(this.value);
                        this.o.cursor
                            && (sa = ea - 0.3)
                            && (ea = ea + 0.3);
                        this.g.beginPath();
                        this.g.strokeStyle = this.previousColor;
                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sa, ea, false);
                        this.g.stroke();
                    }

                    this.g.beginPath();
                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, sat, eat, false);
                    this.g.stroke();

                    this.g.lineWidth = 2;
                    this.g.beginPath();
                    this.g.strokeStyle = this.o.fgColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                    this.g.stroke();

                    return false;
                }
            }
        });
    }
    componentDidMount() {
        this.drawKnobs();
    }
    componentDidUpdate(prevProps, prevState) {
        // One possible fix...
        if (prevProps.data != this.props.kegs ) {
            this.drawKnobs();
        }
    }
    render() {
        var keg = {
            "Name": "No name provided",
            "Level": 1,
            "imagePath": "/imgs/app/avatars/beer.png",
            "BeerDescription": "No description available",
            "Brewery": "NA",
            "BeerType": "NA",
            "ABV": "ABV NA",
            "IBU": "IBU NA",
            "InstallDate": "2017-01-18T23:30:00.000Z"

        }


        var kegs = [keg, Object.assign({}, keg)];
        this.props.kegs.forEach(function (elem, index) {
            if (elem.length === 0 && elem.constructor === Object) {
                return;
            }
            if (elem.Name != null && elem.Name.length > 0) {
                kegs[elem.TapId - 1].Name = elem.Name;
            }
            if (elem.CurrentVolume > 0 && elem.KegSize > 0) {
                kegs[elem.TapId - 1].Level = Math.round(elem.CurrentVolume / elem.KegSize * 100);
            }
            if (elem.imagePath != null && elem.imagePath.length > 0) {
                kegs[elem.TapId - 1].imagePath = elem.imagePath;
            }
            if (elem.BeerDescription != null && elem.BeerDescription.length > 0) {
                kegs[elem.TapId - 1].BeerDescription = elem.BeerDescription;
            }
            if (elem.Brewery != null && elem.Brewery.length > 0) {
                kegs[elem.TapId - 1].Brewery = elem.Brewery;
            }
            if (elem.BeerType != null && elem.BeerType.length > 0) {
                kegs[elem.TapId - 1].BeerType = elem.BeerType;
            }
            if (elem.ABV && elem.ABV != "NA") {
                kegs[elem.TapId - 1].ABV = elem.ABV + "% ABV";
            }
            if (elem.IBU && elem.IBU != "NA") {
                kegs[elem.TapId - 1].IBU = elem.IBU + " IBU";
            }
            if (elem.InstallDate != null && elem.InstallDate.length > 0) {
                kegs[elem.TapId - 1].InstallDate = moment(elem.InstallDate).fromNow;
            }
        });
        return (
            <PanelContainer>
                <PanelHeader className='bg-blue fg-white'>
                    <Grid>
                        <Row>
                            <Col xs={12}>
                                <h3>Keg Status</h3>
                            </Col>
                        </Row>
                    </Grid>
                </PanelHeader>
                <PanelBody>
                    <Grid>
                        <br />
                        <Row>
                            {kegs.map(function (elem, index, ar) {
                                return (
                                    <Col key={"col-1-" + index} xs={6} className='text-center'>
                                        <img key={index} src={elem.imagePath} height="100" />
                                    </Col>
                                );
                            })}
                        </Row>
                        <Row>
                            {kegs.map(function (elem, index, ar) {
                                return (
                                    <Col key={"col-2-" + index} xs={6} className='text-center fg-darkgrayishblue75'>
                                        <h2>{elem.Name}</h2>
                                    </Col>
                                );
                            })}
                        </Row>
                        <Row>
                            {kegs.map(function (elem, index, ar) {
                                return (
                                    <Col key={"col-3-" + index} xs={6} className='text-center'>
                                        <h4 key={index}>{elem.Brewery}</h4>
                                    </Col>
                                );
                            })}
                        </Row>
                        <Row className="hidden-xs">
                            {kegs.map(function (elem, index, ar) {
                                var level = elem.Level;
                                var color = (level >= 25) ? ((level >= 75) ? '#4DBD33' : '#FFA500') : '#ffcccc';
                                return (
                                    <Col key={"col-4a-" + index} xs={6} className='text-center'>
                                        <input key={index} type='text' value={level + "%"} className='dial autosize' data-width='100%' data-fgcolor={color} readOnly='readOnly' />
                                    </Col>
                                );
                            })}
                        </Row>
                        <Row className="visible-xs">
                            {kegs.map(function (elem, index, ar) {
                                var level = elem.Level;
                                var badgeColor = (level >= 25) ? ((level >= 75) ? "bg-green" : "bg-orange") : "bg-red";
                                return (
                                    <Col key={"col-4b-" + index} xs={6} className='text-center'>
                                        <Label key={index + "b"} className={badgeColor}>{level}% full</Label>
                                    </Col>
                                );
                            })}
                        </Row>
                        <Row>
                            {kegs.map(function (elem, index, ar) {
                                var badgeColor = elem.BeerType.toLowerCase().includes("red") ? "bg-red" : elem.BeerType.toLowerCase().includes("ipa") ? "bg-blue" : "bg-purple";
                                return (
                                    <Col key={"col-5a-" + index} xs={6} className='text-center'>
                                        <Badge key={index + "a"} className={badgeColor + " hidden-xs"} style={{ marginRight: 5, display: 'inline' }}>{elem.BeerType}</Badge>
                                        <p key={index + "b"} className="visible-xs">{elem.BeerType}</p>

                                    </Col>
                                );
                            })}
                        </Row>

                        <Row>
                            {kegs.map(function (elem, index, ar) {
                                return (
                                    <Col key={"col-6-" + index} xs={6} className='text-center'>
                                        <p><Label key={index} className='bg-orange75 fg-white'>{elem.ABV}</Label> <Label className='bg-yellow fg-white'>{elem.IBU}</Label></p>
                                    </Col>
                                );
                            })}
                        </Row>
                        <br />
                    </Grid>
                </PanelBody>
            </PanelContainer>
        );
    }
}
