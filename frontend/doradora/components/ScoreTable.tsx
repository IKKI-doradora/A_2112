import * as React from 'react';
import { View, StyleSheet,ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
import { useState } from 'react';
import { GameDetail, Round } from '../types';

const CONTENT = {
  // tableHead: ['', 'PL1', 'PL2'],
  tableHead: ['', 'PL1'],
  // tableTitle: ['Total Score','R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
  headerWidth: [170, 170],
  // rowWidth: [65,65,65,65]
};

type ScoreTableProps = {
  scores: GameDetail;
};

export default function ScoreTable(props: ScoreTableProps) {
  // const [state, setState] = useState({tableHead:CONTENT.tableHead})
  const rawData = props.scores;
  const TotalScore = [`Total Score`,`${rawData.totalScore}`];

  const tableData = [];
  const ZeroData: Round = {darts: [], score: 0};

  for (let i = 0; i < 8; i += 1) {
    const rowData = [`R${i+1}`];
    // rawData.rounds.push(ZeroData);
    for (let j = 1; j < 2; j += 1) {
      rowData.push(`${rawData.rounds[i].score}`);
    }
    tableData.push(rowData);
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal={true}>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
            {/* <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/> */}
            <Row
              key={0}
              data={TotalScore}
              widthArr={CONTENT.headerWidth}
              style={styles.header}
              textStyle={[styles.text,{color: "white"}]}
            />
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              {
                tableData.map((rowData, index) => (
                  <Row
                    key={index+1}
                    data={rowData}
                    widthArr={CONTENT.headerWidth}
                    style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
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
  row: { height: 45, backgroundColor: '#E7E6E1' }
});