import { useState } from "react"
import { Modal, StyleSheet, View } from "react-native"
import { RadarChart } from "@salmonco/react-native-radar-chart"
import { SafeAreaView } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import PlayerSkillRatingModal, { PlayerSkillRatings } from "@/components/ui/PlayerSkillRatingModal"

// It sucks that I have to use a radar chart from a random person
// TODO maybe implement radar chart yourself?

const CHART_ORANGE = "#FF9432"
const CHART_ORANGE_LIGHT = "#FFE8D3"
const CHART_ORANGE_PALE = "#FFF8F1"
const CHART_ORANGE_STROKE = "#ff9532"
const CHART_SALMON = "salmon"
const TEXT_DARK = "#433D3A"
const SCREEN_OVERLAY = "rgba(0,0,0,0.5)"
const WHITE = "white"
const VALUE_BACKGROUND = "#F4F2F1"
const CANCEL_RED = "red"

type RadarDataItem = {
  label: string
  value: number
}

type EditableRadarDataItem = {
  label: string
  value: string
}

const INITIAL_DATA: RadarDataItem[] = [
  { label: "Speed", value: 30 },
  { label: "Fun", value: 55 },
  { label: "Height", value: 70 },
  { label: "Effort", value: 35 },
  { label: "Test1", value: 10 },
  { label: "data6", value: 60 },
  { label: "data7", value: 38 },
  { label: "data8", value: 65 },
]

const PlayerStatsScreen = () => {
  const [data, setData] = useState<RadarDataItem[]>(INITIAL_DATA)
  const [modalVisible, setModalVisible] = useState(false)
  const [skillRatingModalVisible, setSkillRatingModalVisible] = useState(false)
  const [editedData, setEditedData] = useState<EditableRadarDataItem[]>(
    INITIAL_DATA.map((item) => ({ ...item, value: String(item.value) })),
  )
  const [skillRatings, setSkillRatings] = useState<Partial<PlayerSkillRatings>>({})

  const openEditDataModal = () => {
    setEditedData(data.map((item) => ({ ...item, value: String(item.value) })))
    setModalVisible(true)
  }

  const updateData = () => {
    setData(
      editedData.map((item) => ({
        label: item.label,
        value: parseFloat(item.value) || 0,
      })),
    )
    setModalVisible(false)
  }

  const saveSkillRatings = (ratings: PlayerSkillRatings) => {
    setSkillRatings(ratings)
    setSkillRatingModalVisible(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Stats</Text>
      <RadarChart
        data={data}
        maxValue={100}
        gradientColor={{
          count: 5,
          endColor: CHART_ORANGE_PALE,
          startColor: CHART_ORANGE,
        }}
        stroke={[
          CHART_ORANGE_LIGHT,
          CHART_ORANGE_LIGHT,
          CHART_ORANGE_LIGHT,
          CHART_ORANGE_LIGHT,
          CHART_ORANGE_STROKE,
        ]}
        strokeWidth={[0.5, 0.5, 0.5, 0.5, 1]}
        strokeOpacity={[1, 1, 1, 1, 0.13]}
        labelColor={TEXT_DARK}
        dataFillColor={CHART_ORANGE}
        dataFillOpacity={0.8}
        dataStroke={CHART_SALMON}
        dataStrokeWidth={2}
      />

      <Button text="Edit Data" onPress={openEditDataModal} style={styles.actionButton} />

      <View style={styles.skillRatingSection}>
        <Button
          text="Rate Player Skills"
          onPress={() => setSkillRatingModalVisible(true)}
          style={styles.actionButton}
        />
        <View style={styles.skillRatingValues}>
          {Object.entries(skillRatings).length ? (
            Object.entries(skillRatings).map(([skill, value]) => (
              <Text key={skill} style={styles.skillRatingText}>
                {skill}: {value}
              </Text>
            ))
          ) : (
            <Text style={styles.skillRatingText}>No skill ratings yet.</Text>
          )}
        </View>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Data</Text>
          {data.map((item, index) => (
            <View key={item.label} style={styles.inputContainer}>
              <Text>{item.label}:</Text>
              <TextField
                containerStyle={styles.input}
                keyboardType="numeric"
                value={editedData[index]?.value || ""}
                onChangeText={(text) => {
                  const newData = [...editedData]
                  newData[index] = { ...newData[index], value: text }
                  setEditedData(newData)
                }}
              />
            </View>
          ))}
          <Button text="Save" onPress={updateData} style={styles.actionButton} />
          <Button
            text="Cancel"
            onPress={() => setModalVisible(false)}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </Modal>
      <PlayerSkillRatingModal
        visible={skillRatingModalVisible}
        ratings={skillRatings}
        onSave={saveSkillRatings}
        onCancel={() => setSkillRatingModalVisible(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    minWidth: 180,
  },
  cancelButton: {
    backgroundColor: WHITE,
    minWidth: 180,
  },
  cancelButtonText: {
    color: CANCEL_RED,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 5,
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: SCREEN_OVERLAY,
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  modalTitle: {
    color: WHITE,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  skillRatingSection: {
    alignItems: "stretch",
    marginTop: 16,
    width: "80%",
  },
  skillRatingText: {
    color: TEXT_DARK,
    fontSize: 16,
    lineHeight: 22,
    textTransform: "capitalize",
  },
  skillRatingValues: {
    backgroundColor: VALUE_BACKGROUND,
    borderRadius: 8,
    marginTop: 10,
    padding: 12,
  },
})

export default PlayerStatsScreen
