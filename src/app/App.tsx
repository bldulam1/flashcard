import React, { useState } from "react"

import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import Container from "@material-ui/core/Container"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Typography from "@material-ui/core/Typography"
import questions from "./questions"

const STUDYMODE = "STUDY"

const testBank = questions
  .sort((a, b) => a.topic.localeCompare(b.topic))
  .filter((q) => q.choices.length)

export default () => {
  const [state, setState] = useState({
    _questions: testBank,
    index: 0,
    _answers: new Array<Set<number>>(testBank.length),
    mode: STUDYMODE,
    showAnswer: false,
  })

  const { question, choices, answers, explanation, topic } = state._questions[
    state.index
  ]
  let selectedAnswers = state._answers[state.index] || new Set()

  const handleChoiceSelect = (choiceIndex: number) => {
    let newAnswers = state._answers

    if (answers.length === selectedAnswers.size) {
      let buffer = Array.from(newAnswers[state.index].values())
      buffer.shift()
      newAnswers[state.index] = new Set(buffer)
    }

    if (selectedAnswers.has(choiceIndex)) {
      newAnswers[state.index].delete(choiceIndex)
    } else {
      newAnswers[state.index] = newAnswers[state.index] || new Set()
      newAnswers[state.index].add(choiceIndex)
    }

    setState((s) => ({ ...s, _answers: newAnswers }))
  }

  const handlePageChange = (increment: number) => {
    setState((s) => ({ ...s, index: s.index + increment }))
  }

  const toggleAnswer = (value: boolean) => {
    setState((s) => ({ ...s, showAnswer: value }))
  }

  const gradeExam = () => {
    let score = 0

    state._questions.forEach((q, qi) => {
      if (q.answers && state._answers[qi]) {
        const intersection = q.answers.filter((answer) =>
          state._answers[qi].has(answer)
        )
        if (intersection.length == q.answers.length) {
          score++
        }
      }
    })
    const results = score / testBank.length > 0.7 ? "PASSED" : "FAILED"
    alert(`Score: ${score}/${testBank.length}, Judgement: ${results}`)
  }

  return (
    <Container maxWidth="lg">
      <Box minHeight="80vh" display="flex" flexDirection="column">
        <Box>
          <Typography variant="caption">{`Question ${state.index} | ${topic}`}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">{question}</Typography>
        </Box>
        <Box>
          <List>
            {choices.map((choice, index) => (
              <ListItem
                button
                dense
                key={`choice-${choice}`}
                onClick={() => handleChoiceSelect(index)}
                disabled={state.showAnswer && !answers.includes(index)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={
                      selectedAnswers.has(index) ||
                      (state.showAnswer && answers.includes(index))
                    }
                  />
                </ListItemIcon>
                <ListItemText primary={choice} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            disabled={state.index < 1}
            onClick={() => handlePageChange(-1)}
            size="small"
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={state.index > state._questions.length - 2}
            onClick={() => handlePageChange(1)}
            size="small"
          >
            Next
          </Button>
          <Button
            disabled={state.mode !== STUDYMODE}
            variant="outlined"
            onMouseDown={() => toggleAnswer(true)}
            onMouseUp={() => toggleAnswer(false)}
            size="small"
          >
            Peek Answer
          </Button>
          <Button onClick={gradeExam}>Grade Exam</Button>
        </Box>
        <Box hidden={!state.showAnswer}>
          <Typography>{explanation}</Typography>
        </Box>
      </Box>
    </Container>
  )
}
