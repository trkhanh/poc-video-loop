import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'

export default class VideoLooper extends React.Component {

    static propTypes = {
        source: PropTypes.string.isRequired,
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,

        speed: PropTypes.number,
        loopCount: PropTypes.number,
        autoPlay: PropTypes.bool,
        muted: PropTypes.bool,
        isDebugMode: PropTypes.bool,
        isSplitView: PropTypes.bool,
        width: PropTypes.string,
        height: PropTypes.string,
        objectFit: PropTypes.string,
        objectPosition: PropTypes.string,
    }

    static defaultProps = {
        speed: 1,
        loopCount: null,
        autoPlay: true,
        muted: true,
        isDebugMode: false,
        isSplitView: false,
        width: '100%',
        height: '100vh',
        objectFit: 'cover',
        objectPosition: '40%'
    }

    constructor(props) {
        super(props);

        this.state = {
            isVideoCloneActive: false,
            currentLoop: 0,
            isPlaying: false,
            currentTime: 0
        }
    }

    componentDidMount() {
        this.video.addEventListener('loadeddata', this.onLoadedVideo.bind(this));
        this.videoClone.addEventListener('loadeddata', this.onLoadedVideoClone.bind(this));
        this.video.addEventListener('ended', this.onEndedVideo.bind(this));
        this.videoClone.addEventListener('ended', this.onEndedVideo.bind(this));
    }

    componentDidUpdate(prevProps) {
        const nextVideo = this.state.isVideoCloneActive ? 'video' : 'videoClone';
        if (this.props.start !== prevProps.start && this.props.start < this.video.duration) {
            this[nextVideo].currentTime = Number(this.props.start);
        }

        if (this.props.speed !== prevProps.speed) {
            this.video.playbackRate = this.props.speed;
            this.videoClone.playbackRate = this.props.speed;
        }

    }

    componentWillUnmount() {
        cancelAnimationFrame(this._frameId);
    }

    onLoadedVideo(){
        this.video.pause();
        this.props.autoPlay && this.togglePlayback();
        this.video.playbackRate = this.props.speed || 1;
    }

    
}