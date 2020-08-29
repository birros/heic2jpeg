import React from 'react'

const Error = () => <p>Error...</p>

Error.getInitialProps = async () => {
  return {
    namespacesRequired: ['common'],
  }
}

export default Error
