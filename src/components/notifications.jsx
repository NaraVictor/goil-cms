import { Notification } from '@mantine/core'
import React from 'react'

export const SuccessNotification = ( title, message ) => {
    return (
        <Notification icon={ <span className='bi bi-check-all' size="1.1rem" /> } color="teal" title={ title || "Success" }>
            { message }
        </Notification>
    )
}
export const LoadingNotification = ( title, message ) => {
    return (

        <Notification
            loading
            title={ title || "Working..." }
            withCloseButton={ false }
        >
            { message }
        </Notification>

    )
}
export const ErrorNotification = ( title, message ) => {
    return (
        <Notification icon={ <span className="bi bi-x" /> } color="red" title={ title || "Error" }>
            { message }
        </Notification>

    )
}
export const DefaultNotification = ( title, message ) => {
    return (
        <Notification title={ title }>
            { message }
        </Notification>
    )
}
