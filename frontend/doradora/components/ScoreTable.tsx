import * as React from 'react';
import { View, StyleSheet,ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { GameDetail } from '../types';

type ScoreTableProps = {
  details: GameDetail[];
};

export default function ScoreTable({details}: ScoreTableProps) {
  const detailsLength = details.length;
  const tableHeader = ['', ...Array(detailsLength).fill('').map((_, i) => `PL${i+1}`)];
  const WidthList = Array(detailsLength+1).fill(170);

  const totalScore = ['Total Score', ...details.map(v => v.totalScore)];
  const tableData = Array(8).fill(1).map((_, i) => [`R${i+1}`, ...details.map(v => v.rounds[i].score)]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            <Row
              key={-1}
              data={tableHeader}
              widthArr={WidthList}
              style={styles.header}
              textStyle={[styles.text, {color: "white"}]}
            />
            <Row
              key={0}
              data={totalScore}
              widthArr={WidthList}
              style={styles.header}
              textStyle={[styles.text, {color: "white"}]}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              {
                tableData.map((rowData, index) => (
                  <Row
                    key={index+1}
                    data={rowData}
                    widthArr={WidthList}
                    style={index % 2 ? styles.evenRow : styles.oddRow}
                    textStyle={styles.text}
                  />
                ))
              }
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 1, paddingTop: 1},
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontSize: 17, fontWeight: '400' },
  dataWrapper: { marginTop: -1 },
  oddRow: { height: 45, backgroundColor: '#E7E6E1' },
  evenRow: { height: 45, backgroundColor: '#F7F6E7' },
});