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
import * as sc from 'spatialconnect';

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
    console.log(sc);
    sc.startAllServices();
    sc.loadDefaultConfigs();

    sc.lastKnownLocation().subscribe(data => {
      console.log('received location', data);
    });

    sc.stores().subscribe(data => {
      console.log('received stores', data);
      this.setState({
        stores: data.stores
      });
    });

    sc.store('a5d93796-5026-46f7-a2ff-e5dec85heh6b').subscribe(data => {
      console.log('received store by id', data);
    });

    var filter = sc.geoBBOXContains([-180, -90, 180, 90]);
    sc.geospatialQuery(filter)
    .first()
    .subscribe(data => console.log('received feature from query', JSON.parse(data)));
    sc.geospatialQuery(filter)
    .takeUntil(Rx.Observable.timer(5000))
    .count()
    .subscribe(data => console.log('number of features returned', data));

    var geojson = {
      "type" : "Feature",
      "geometry" : { "type" : "Point", "coordinates" : [ -72.9813210022207, 18.4274079607845 ] },
      "properties" : { "cpyrt_note" : "http://www.copyright.gov/" }
    };
    // TODO: create feature action shouldn't need the store id and layer b/c it
    // should be in the SCKeyTuple that's part of the feature's id or key property
    // TODO: document that it's easier to send geojson strings instead of objects
    sc.createFeature(
      JSON.stringify(geojson),
      'a5d93796-5026-46f7-a2ff-e5dec85heh6b',
      'point_features'
    ).subscribe((data) => {
      console.log('received newly created feature', JSON.parse(data));
    });

    var geojsonUpdate = {
      "type" : "Feature",
      "geometry" : { "type" : "Point", "coordinates" : [ -72.9813210022207, 18.4274079607845 ] },
      "properties" : { "cpyrt_note" : "updated" },
      "id": "YTVkOTM3OTYtNTAyNi00NmY3LWEyZmYtZTVkZWM4NWhlaDZi↵.cG9pbnRfZmVhdHVyZXM=↵.MTAwMQ==↵"
    };
    sc.updateFeature(JSON.stringify(geojsonUpdate));
    sc.deleteFeature("YTVkOTM3OTYtNTAyNi00NmY3LWEyZmYtZTVkZWM4NWhlaDZi↵.cG9pbnRfZmVhdHVyZXM=↵.MTAwMQ==↵");
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
