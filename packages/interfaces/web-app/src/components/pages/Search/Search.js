import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Spotlight from 'components/molecules/Spotlight'
import SearchResult from 'components/atoms/SearchResult'
import Duration from 'components/atoms/Duration'

import { ReactComponent as Play } from 'assets/play.svg'
import { ReactComponent as Stop } from 'assets/stop.svg'

import { getProjects, startProject, stopProject } from 'redux/timelog'

import style from './Search.module.scss'

const byName = value => project => {
  if (value.length < 3) {
    return false
  }

  const projectContains = value =>
    project.name.toLowerCase().includes(value.toLowerCase())

  return projectContains(value) || value.split(/ /g).every(projectContains)
}

const byDate = (projectA, projectB) => {
  if (projectA.startedAt < projectB.startedAt) {
    return 1
  }

  if (projectA.startedAt > projectB.startedAt) {
    return -1
  }

  return 0
}

const noStopped = project => project.stoppedAt === null

const withExactName = value => project =>
  project.name.toLowerCase() === value.toLowerCase()

export default () => {
  const [results, setResults] = useState([])
  const [search, setSearch] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [currentProject, setCurrentProject] = useState(null)

  const projects = useSelector(getProjects)
  const dispatch = useDispatch()

  const updateResults = value => {
    let newResults = []

    if (value.length >= 3) {
      newResults = projects.filter(byName(value)).sort(byDate)
      if (!newResults.find(withExactName(value))) {
        newResults.push({
          id: 'new-project',
          name: value,
          stoppedAt: null,
        })
      }
    } else if (!currentProject) {
      newResults = projects.sort(byDate).slice(0, 3)
    }

    setResults(newResults)
  }

  const onChange = value => {
    setSearch(value)
    updateResults(value)

    setActiveIndex(0)
  }

  const onKeyDown = event => {
    if (event.key === 'ArrowUp') {
      if (activeIndex < results.length - 1) {
        setActiveIndex(activeIndex + 1)
      }

      event.preventDefault()
    } else if (event.key === 'ArrowDown') {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1)
      }

      event.preventDefault()
    }
  }

  const onSubmit = () => {
    if (results.length > activeIndex) {
      toggleProject(results[activeIndex])
    }
  }

  const updateContext = () => {
    setCurrentProject(projects.find(noStopped))
  }

  const toggleProject = project => {
    if (currentProject && project.id !== currentProject.id) {
      dispatch(stopProject(currentProject.id))
    }

    if (project.stoppedAt || !project.startedAt) {
      dispatch(startProject(project.id, project.name))
      setCurrentProject(project)
    } else {
      dispatch(stopProject(project.id))
      setCurrentProject(null)
    }

    onChange('')
  }

  useEffect(() => {
    updateContext()
    updateResults(search)
  }, [projects])

  return (
    <div className={style.Search}>
      <div className={style.main}>
        <div className={style.container}>
          {currentProject ? (
            <div
              className={style.context}
              onClick={() => toggleProject(currentProject)}
            >
              <h1 className={style.title}>{currentProject.name}</h1>
              <div className={style.duration}>
                <Duration startAt={currentProject.startedAt} />
              </div>
              <div className={style.icon}>
                <Stop />
              </div>
            </div>
          ) : null}
          {results.length > 0 ? (
            <div className={style.results}>
              {results.map((project, index) => (
                <SearchResult
                  key={project.id}
                  label={
                    <>
                      {project.stoppedAt || !project.startedAt
                        ? 'Start'
                        : 'Stop'}{' '}
                      <b>{project.name}</b>
                    </>
                  }
                  active={index === activeIndex}
                  icon={
                    project.stoppedAt || !project.startedAt ? (
                      <Play />
                    ) : (
                      <Stop />
                    )
                  }
                  onClick={() => toggleProject(project)}
                />
              ))}
            </div>
          ) : null}
        </div>
        <Spotlight
          onSubmit={onSubmit}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={search}
        />
      </div>
    </div>
  )
}
