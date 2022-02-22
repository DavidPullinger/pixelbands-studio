import "./VolumeSlider.css";
import meter from "../../assets/bottom-left/meter.png";
import maxVolume from "../../assets/bottom-left/maxVolume.png";
import volumeSlider from "../../assets/bottom-left/volumeSlider.png";
import volumeHandle from "../../assets/bottom-left/volumeHandle.png";
import { useEffect } from "react";
var jquery = require("jquery");
window.$ = window.jQuery = jquery; // notice the definition of global variables here
require("jquery-ui-dist/jquery-ui.js");

function VolumeSlider({ id, role }) {
  const emoji = () => {
    switch (role) {
      case "Guitar":
        return "🎸";
      case "Bass":
        return "🔊";
      case "Drums":
        return "🥁";
      case "Keyboard":
        return "🎹";
      default:
        return "";
    }
  };

  useEffect(() => setUp());

  const setUp = () => {
    // set height of containers
    let temp = parseInt($(`#${id} .volume .meter`).css("height"));
    $(`#${id} .volume`).css("height", temp);
    $(`#${id} .volume .meter`).css("bottom", temp);
    temp = parseInt($(`#${id} .slider .slider-track`).css("height"));
    $(`#${id} .slider`).css("height", temp);
    // get all components
    let knob = $(`#${id} .slider .knob`);
    let slider = $(`#${id} .slider`);
    let meter = $(`#${id} .volume .meter`);
    let interval;
    let height;
    let value;

    // add draggable function to knob
    knob
      .draggable({ axis: "y", containment: ".slider", scroll: false })
      .mousedown(() => {
        // method to continuously check position of handle and change volume accordingly
        interval = setInterval(() => {
          // get height and volume
          height =
            parseInt(slider.css("height")) - parseInt(knob.css("height"));
          //value = Math.abs(parseInt(knob.css("top")) / height - 1);
          value = parseInt(knob.css("bottom")) / height;
          value = Math.round(value * 100) / 100;
          // store volume
          if (role && value && value !== NaN)
            sessionStorage.setItem(role, value);
          // set volume according to value
          let video = $(`#${role}`);
          if (video.length) {
            if (value > 0.02) video[0].volume = value;
            else video[0].volume = 0;
          }
          // change display of volume
          meter.css("bottom", value * parseInt(meter.css("height")));
        }, 25);
      })
      .mouseup(() => {
        clearInterval(interval);
      });

    // fix error where volume handle moves when window gets smaller
    $(window).on("resize", () => {
      // change volume to 1
      let video = $(`#${role}`);
      if (video.length) video[0].volume = 1;
      // change handle to full volume
      knob.css("top", 0);
      let temp = parseInt(meter.css("height"));
      $(`#${id} .volume`).css("height", temp);
      temp = parseInt($(`#${id} .slider .slider-track`).css("height"));
      $(`#${id} .slider`).css("height", temp);
      // change display of volume
      meter.css("bottom", parseInt(meter.css("height")));
    });

    $(window).trigger("resize"); // fixes sizing issues
  };

  $(window).on("load", setUp);

  return (
    <div id={id} className="meter-slider">
      <div className="volume">
        <img className="meter" src={meter} alt="meter" />
        <img className="max-vol" src={maxVolume} alt="max volume" />
      </div>
      <span className="emoji">{emoji()}</span>
      <div className="slider">
        <img className="slider-track" alt="volume slider" src={volumeSlider} />
        <img className="knob" alt="volume handle" src={volumeHandle} />
      </div>
    </div>
  );
}

module.exports = VolumeSlider;
