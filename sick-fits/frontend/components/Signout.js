import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

const SIGNOUT_MUTATION=gql`
    mutation SIGNOUT_MUTATION{
        signout{
            message
        }
    }
`


const Signout=props=>(
            <Mutation mutation-={SIGNOUT_MUTATION}>
                {signout=><button onClick={signout}>Sign Out</button>}
            </Mutation>
)


export default Signout