'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';
import sc from 'spatialconnect';

class SCMobile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stores: []
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Stores list:
        </Text>
        <Text>
          {this.state.stores.map(function(s){return s.name})}
        </Text>
      </View>
    );
  }

  componentDidMount() {
    // TODO: fix spatialconnect-js so you can subscribe to the actions
    sc.stream.lastKnownLocation.subscribe(data => {
      console.log('received location', data);
    });
    sc.action.enableGPS();

    // TODO: fix spatialconnect-js so you can subscribe to the actions
    sc.stream.stores.subscribe(data => {
      console.log('received stores', data);
      this.setState({
        stores: data.stores
      });
    });
    sc.action.stores();

    // TODO: fix spatialconnect-js so you can subscribe to the actions
    sc.stream.store.subscribe(data => {
      console.log('received store by id', data);
    });
    sc.action.store('a5d93796-5026-46f7-a2ff-e5dec85heh6b');


    // TODO: fix spatialconnect-js so you can subscribe to the actions
    sc.stream.spatialQuery.first().subscribe((data) => {
      console.log('received feature from query', JSON.parse(data));
      // console.log('received feature from query', data);
    });
    var f = sc.Filter().geoBBOXContains([-180, -90, 180, 90]);
    sc.action.geospatialQuery(f)

    // TODO: fix spatialconnect-js so you can subscribe to the actions
    sc.stream.createFeature.subscribe((data) => {
      console.log('received newly created feature', JSON.parse(data));
    });
    var geojson = {
      "type" : "Feature",
      "geometry" : { "type" : "Point", "coordinates" : [ -72.9813210022207, 18.4274079607845 ] },
      "properties" : { "cpyrt_note" : "http://www.copyright.gov/" }
    };
    // TODO: create feature action shouldn't need the store id and layer b/c it
    // should be in the SCKeyTuple that's part of the feature's id property
    // TODO: document that it's easier to send geojson strings instead of objects
    sc.action.createFeature(JSON.stringify(geojson), 'a5d93796-5026-46f7-a2ff-e5dec85heh6b', 'point_features');


    var geojsonUpdate = {
      "type" : "Feature",
      "geometry" : { "type" : "Point", "coordinates" : [ -72.9813210022207, 18.4274079607845 ] },
      "properties" : { "cpyrt_note" : "updated" },
      "id": "YTVkOTM3OTYtNTAyNi00NmY3LWEyZmYtZTVkZWM4NWhlaDZi↵.cG9pbnRfZmVhdHVyZXM=↵.MTAwMQ==↵"
    };
    sc.action.updateFeature(JSON.stringify(geojsonUpdate));
    sc.action.deleteFeature("YTVkOTM3OTYtNTAyNi00NmY3LWEyZmYtZTVkZWM4NWhlaDZi↵.cG9pbnRfZmVhdHVyZXM=↵.MTAwMQ==↵");

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('SCMobile', () => SCMobile);
