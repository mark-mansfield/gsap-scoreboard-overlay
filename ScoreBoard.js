import React, { PureComponent } from "react";
import { TimelineLite, CSSPlugin } from "gsap/all";



  const scoreBoardTimeLineComplete = () => {
    console.log("scoreboard  timeline complete");
    if (this.props.animation.length !== 2) {
      this.clockTimeLine.play();
    }
  };

  const clockTimeLineComplete = () => {
    console.log("clock timeline complete");
  };

class ScoreBoard extends PureComponent {
  constructor(props) {
    super(props);

    this.scoreboardRef = null;
    this.scoreboardRef_homeTeam = null;
    this.scoreboardRef_scores = null;
    this.scoreboardRef_awayTeam = null;
    this.clockRef = null;
    this.teamStatRef = null;

    this.scorboardTimeline = new TimelineLite({ paused: true });
    this.clockTimeLine = new TimelineLite({ paused: true });
    this.teamStatTimeline = new TimelineLite({ paused: true });
  }


  

  componentDidMount() {
    console.log("default animation", this.props.animation);

    // score board timeline
    this.scorboardTimeline.from(this.scoreboardRef, null, {
        onComplete: this.scoreBoardTimeLineComplete,
      })
      .from(this.scoreboardRef_scores, 1, {
        scaleX: 0,
        autoAlpha: 0
      })
      .from(this.scoreboardRef_homeTeam, 1, {
        autoAlpha: 0,
      })
      .to(this.scoreboardRef_homeTeam, 1, {
        left: 0,
      })
      .from( this.scoreboardRef_awayTeam, 1,
        {
          autoAlpha: 0,
        }
      ).to(this.scoreboardRef_awayTeam, 1, {
        left: 100,
      });

    //  clock timeline
    this.clockTimeLine.from(this.clockRef, 2, {
      onComplete: this.clockTimeLineComplete,
    })
    .from(this.clockRef, 1, {
       autoAlpha: 0
      })
     .to(this.clockRef, 1,{
       right: 150
     });

    // team stats time line
    this.teamStatTimeline.from(this.teamStatRef, 0.8, { autoAlpha: 0 });
  }

  // compare props
  componentDidUpdate(prevProps, prevState) {
    //   prev and current Props
    console.log(prevProps.animation.length);
    console.log(this.props.animation.length);

    // play the scoreboard animation 0 : 1
    if (prevProps.animation.length === 0 && this.props.animation.length === 1) {
      this.scorboardTimeline.delay(this.props.animation[0].delay);
      this.scorboardTimeline.play();
      console.log("play the scoreboard animation");
    }

    // reverse the clock animation
    // play the team stat animation  1 : 2
    if (this.props.animation.length === 2) {
      this.clockTimeLine.reverse(0.3);
      this.teamStatTimeline.delay(this.props.animation[0].delay);
      this.teamStatTimeline.play();
      console.log("reverse the clock animation");
      console.log("play the team stat animation");
    }

    // reverse the team Stat and play the clock animation
    if (prevProps.animation.length === 2 && this.props.animation.length === 1) {
      this.teamStatTimeline.reverse();
      this.clockTimeLine.play();
      console.log("reverse the team stat animation");
      console.log("play the clock animation");
    }

    if (prevProps.animation.length === 1 && this.props.animation.length === 0) {
      this.clockTimeLine.reverse(0.3);
      this.scorboardTimeline.reverse();
      console.log("reverse the scoreboard animation");
    }

    if (prevProps.animation.length === 2 && this.props.animation.length === 0) {
      this.teamStatTimeline.reverse(0.3);
      this.clockTimeLine.set(this.clockRef, { alpha: 0 });
      this.scorboardTimeline.reverse(1);
      console.log("reverse the scoreboard animation");
    }
  }

  render() {
    console.log("props", this.props.animation);
    return (
      <div className="overlay-bg">
        <div>
          <div className="scoreboard">
            <div className="d-flex" ref={div => (this.scoreboardRef = div)}>
              <div
                // effect slide left
                className="hometeam"
                ref={div => (this.scoreboardRef_homeTeam = div)}
                style={{
                  backgroundColor: this.props.homeTeamColor,
                  textAlign: "center",
                  width: "50px"
                }}
              >
                GG
              </div>

              <div
                className="scores"
                // effect fade in and scaleX
                ref={div => (this.scoreboardRef_scores = div)}
                style={{
                  backgroundColor: "orange",
                  textAlign: "center",
                  width: "50px"
                }}
              >
                2:0{" "}
              </div>

              <div
                className="awayteam"
                // effect slide right
                ref={div => (this.scoreboardRef_awayTeam = div)}
                style={{
                  backgroundColor: this.props.awayTeamColor,
                  textAlign: "center",
                  width: "50px"
                }}
              >
                MU
              </div>
              <div
                ref={div => (this.clockRef = div)}
                className="clock"
                style={{
                  backgroundColor: "black",
                  textAlign: "center",
                  width: "50px",
                  height: "24px"
                }}
              >
                90:00
              </div>
            </div>

            <div
              ref={div => (this.teamStatRef = div)}
              style={{
                backgroundColor: this.props.awayTeamColor,
                textAlign: "center",
                width: "200px"
              }}
            >
              GG
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScoreBoard;
