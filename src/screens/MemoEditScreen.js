import React from 'react';
import {
  StyleSheet, KeyboardAvoidingView, TextInput,
} from 'react-native';
import firebase from 'firebase';
import CircleButton from '../elements/CircleButton';

class MemoEditScreen extends React.Component {
  state = {
    body: '',
    key: '',
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    this.setState({
      body: params.body,
      key: params.key,
    });
  }

  handlePress() {
    const db = firebase.firestore();
    const { currentUser } = firebase.auth();
    const newDate = new Date();
    db.settings({ timestampsInSnapshots: true });
    db.collection(`users/${currentUser.uid}/memos`).doc(this.state.key)
      .update({
        body: this.state.body,
        createdOn: newDate,
      })
      .then(() => {
        const { navigation } = this.props;
        navigation.state.params.returnMemo({
          body: this.state.body,
          key: this.state.key,
          createdOn: newDate,
        });
        navigation.goBack();
      })
      .catch(() => {
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="height" keyboardVerticalOffset={80}>
        <TextInput
          style={styles.memoEditInput}
          multiline
          value={this.state.body}
          onChangeText={(text) => { this.setState({ body: text }); }}
          underlineColorAndroid="transparent"
          textAlignVertical="top"
        />
        <CircleButton
          name="check"
          onPress={this.handlePress.bind(this)}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  memoEditInput: {
    flex: 1,
    paddingTop: 32,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    fontSize: 20,
  },
});

export default MemoEditScreen;
