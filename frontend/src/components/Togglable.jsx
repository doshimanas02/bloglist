import { useState, useImperativeHandle, React } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@/components/ui/button'

const Togglable = ({ buttonText, ref, children }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })
  const showWhenVisible = { display: visible ? '' : 'none' }
  const hideWhenVisible = { display: visible ? 'none' : '' }
  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{buttonText}</Button>
      </div>
      <div style={showWhenVisible}>
        <div>{children}</div>
        <Button onClick={toggleVisibility} style={{ marginTop: '5px' }}>Cancel</Button>
      </div>
    </div>
  )
}

Togglable.propTypes = {
  buttonText: PropTypes.string.isRequired
}

export default Togglable
