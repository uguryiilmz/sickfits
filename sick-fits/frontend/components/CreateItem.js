import React, { Component } from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import Router from 'next/router'

const CREATE_ITEM_MUTATION=gql `
    mutation CREATE_ITEM_MUTATION (
        $title:String!
        $description:String!
        $price: Int!
        $image:String
        $largeImage:String
    ){
        createItem(
            title:$title
            description:$description
            price: $price
            image :$image
            largeImage : $largeImage
        ){
            id  
        }
    }
`

class CreateItem extends Component {
    state={
        title:'cool shoes',
        description: 'I love those context',
        image: 'dog.jpg',
        largeImage:'large-dog.jpg',
        price:1000,
    }

    handleChange=(e)=>{
        const {name,type,value}=e.target
        const val=type==='number' ? parseFloat(value) : value
        this.setState({[name]:val})
    }

    uploadFile=async e=>{
        console.log("uploading file....")
        const files= e.target.files
        const data=new FormData()
        data.append('file',files[0])
        data.append('upload_preset','sickfits')

        const res=await fetch
        ('https://api.cloudinary.com/v1_1/dhpjyeugc/image/upload',{
            method:'POST',
            body:data
        })



        const file=await res.json()

        console.log("file ",file)
        this.setState({
            image:file.secure_url,
            largeImage:file.eager[0].secure_url
        })
    }

    render() {
        return (
            <div>
                <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                    {(createItem, {loading, error})=>(
                        <Form 
                            onSubmit={async (e)=>{
                                e.preventDefault()
                                const res=await createItem()
                                Router.push({
                                    pathname:'/item',
                                    query:{id:res.data.createItem.id},
                                })
                            }}>
                            <Error error={error}/>
                            <fieldset disabled={loading} aria-busy={true}>
                                <label htmlFor="file">
                                    Image
                                    <input type="file" id="file" name="file" placeholder="Upload an image" onChange={this.uploadFile}/>
                                </label>                           
                                <label htmlFor="title">
                                    Title
                                    <input type="text" id="title" name="title" placeholder="Title" required value={this.state.title}
                                    onChange={this.handleChange}
                                    />
                                </label>
                                <label htmlFor="price">
                                    Price
                                    <input type="number" id="price" name="price" placeholder="price" required value={this.state.price}
                                    onChange={this.handleChange}
                                    />
                                </label>
                                <label htmlFor="Description">
                                    Description
                                    <textarea type="number" id="description" name="description" placeholder="description" required value={this.state.description}
                                    onChange={this.handleChange}
                                    />
                                </label>
                                <button type="submit">Submit</button>
                            </fieldset>
                        </Form>
                    )}
                </Mutation>

            </div>
        )
    }
}

export default CreateItem;
export {CREATE_ITEM_MUTATION}