import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  maskOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  maskFrame: {
    backgroundColor: 'white',
    opacity: 0.5,
    flex: 1,
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: {
    display: 'flex',
    flexDirection: 'row',
  },
});
