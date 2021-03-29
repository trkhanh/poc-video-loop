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

    onLoadedVideo() {
        this.video.pause();
        this.props.autoPlay && this.togglePlayback();
        this.video.playbackRate = this.props.speed || 1;
    }

    onLoadedVideoClone() {
        this.videoClone.pause();
        this.videoClone.currentTime = this.props.start;
        this.videoClone.playbackRate = this.props.speed || 1;
    }

    togglePlayback = (e) => {
        e && e.preventDefault();
        const currentVideo = this.state.isVideoCloneActive ? 'videoClone' : 'video'

        if (this[currentVideo].paused) {
            this[currentVideo].play();
            this._frameId = requestAnimationFrame(this.tick);
            this.setState({
                isPlaying: true
            })
        }
        else {
            this[currentVideo].pause();
            cancelAnimationFrame(this._frameId);
            this.setState({
                isPlaying: false
            });
        }
    }

    tick = () => {
        this._frameId = requestAnimationFrame(this.tick);

        this.state.isVideoCloneActive
            ? this.checkLoopEnd(this.videoClone, this.video)
            : this.checkLoopEnd(this.video, this.videoClone);

        if (this.props.isDebugMode) {
            this.setState({
                currentTime: this.state.isVideoCloneActive
                    ? (Math.round(this.videoClone.currentTime * 100) / 100).toFixed(2)
                    : (Math.round(this.video.currentTime * 100) / 100).toFixed(2)
            })
        }
    }

    checkLoopEnd(currentVideo, nextVideo) {
        if (currentVideo.currentTime >= this.props.end && (!this.props.loopCount || this.state.currentLoop < this.props.loopCount)) {

            nextVideo.play();

            this.setState({
                isVideoCloneActive: !this.state.isVideoCloneActive,
                currentLoop: this.state.currentLoop + 1
            }, () => {
                currentVideo.pause();
                setTimeout(() => {
                    currentVideo.currentTime = this.props.start;
                }, 500);
            });
        }
    }

    onEndedVideo() {
        cancelAnimationFrame(this._frameId);
        this.setState({
            currentLoop: 0,
            isPlaying: false
        });
    }

    render() {
        return (
            <VideoContainer onClick={this.togglePlayback} {...this.props}>
                <PlayButton {...this.state} {...this.props} />
                <Video ref={(video) => { this.video = video; }} isVisible {...this.props}>
                    <source src={this.props.source} type='video/mp4' />
                </Video>
                <Video ref={(videoClone) => { this.videoClone = videoClone; }} className='videoClone' isVisible={this.state.isVideoCloneActive} {...this.props}>
                    <source src={this.props.source} type='video/mp4' />
                </Video>
                {this.props.isDebugMode &&
                    <Debug isSplitView={this.props.isSplitView} isVideoCloneActive={this.state.isVideoCloneActive} currentTime={this.state.currentTime} />
                }
            </VideoContainer>
        )
    }
}