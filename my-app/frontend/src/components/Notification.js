import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, wasSuccess }) => {
    if (message === null) {
        return null
    }
    const style = (wasSuccess ? 'success' : 'error')
    return (
        <div className={style}>
            {message}
        </div>
    )
}

Notification.propTypes = {
    message: PropTypes.string,
    wasSuccess: PropTypes.bool.isRequired
}
export default Notification