import React, { Component } from 'react'
import {Mutation, Query} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import Router from 'next/router'


const SINGLE_ITEM_QUERY=gql`
    query SINGLE_ITEM_QUERY($id:ID!){
        item(where:{id: $id}){
            id
            title
            description
            price
        }
    }
`

const UPDATE_ITEM_MUTATION=gql `
    mutation UPDATE_ITEM_MUTATION (
        $id:ID!
        $title:String
        $description:String
        $price: Int
    ){
        updateItem(
            id:$id
            title:$title
            description:$description
            price: $price
        ){
            id
            title
            description
            price
        }
    }
`

class UpdateItem extends Component {
    state={}

    handleChange=(e)=>{
        const {name,type,value}=e.target
        const val=type==='number' ? parseFloat(value) : value
        this.setState({[name]:val})
    }

    // uploadFile=async e=>{
    //     console.log("uploading file....")
    //     const files= e.target.files
    //     const data=new FormData()
    //     data.append('file',files[0])
    //     data.append('upload_preset','sickfits')

    //     const res=await fetch
    //     ('https://api.cloudinary.com/v1_1/dhpjyeugc/image/upload',{
    //         method:'POST',
    //         body:data
    //     })



    //     const file=await res.json()

    //     console.log("file ",file)
    //     this.setState({
    //         image:file.secure_url,
    //         largeImage:file.eager[0].secure_url
    //     })
    // }

    updateItem=async (e,updateItemMutation)=>{
        e.preventDefault()
        console.log("updating item")
        console.log(this.state)
        const res=await updateItemMutation({
            variables:{
                id:this.props.id,
                ...this.state
            }

        })
        console.log("UPDATEDD")
    }

    render() {
        return (
            <div>
                <Query query={SINGLE_ITEM_QUERY} variables={{id:this.props.id}}>
                    {({data,loading})=>{
                        if(loading) return <p>Loading...</p>
                        if(!data.item) return<p>No Item found</p>
                        return(
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, {loading, error})=>(
                                <Form onSubmit={e=>this.updateItem(e,updateItem)}>
                                    <Error error={error}/>
                                    <fieldset disabled={loading} aria-busy={true}>                         
                                        <label htmlFor="title">
                                            Title
                                            <input type="text" id="title" name="title" placeholder="Title"  defaultValue={data.item.title}
                                            onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="price">
                                            Price
                                            <input type="number" id="price" name="price" placeholder="price"  defaultValue={data.item.price}
                                            onChange={this.handleChange}
                                            />
                                        </label>
                                        <label htmlFor="Description">
                                            Description
                                            <textarea type="number" id="description" name="description" placeholder="description"  defaultValue={data.item.description}
                                            onChange={this.handleChange}
                                            />
                                        </label>
                                        <button type="submit">Save Changes</button>
                                    </fieldset>
                                </Form>
                            )}
                            </Mutation>
                                )
                    }}
                </Query>
            </div>
        )
    }
}

export default UpdateItem;
export {UPDATE_ITEM_MUTATION}