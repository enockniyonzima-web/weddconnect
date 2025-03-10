/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ENotificationType } from '@/common/CommonTypes';
import { TCategory, TPost, TVendor } from '@/common/Entities'
import { SelectInputGroup, SubmitButton, TextAreaInputGroup, TextInputGroup } from '@/components/forms/DataFormsInputs';
import { FileUploadButton } from '@/components/file-upload/Upload';
import { createUser } from '@/server-actions/user.actions';
import { createVendor } from '@/server-actions/vendor.actions';
import { encryptPassword } from '@/util/bcryptFuncs';
import { showMainNotification } from '@/util/NotificationFuncs';
import { DataInputs } from '@/util/util-classes'
import React, { ChangeEvent, useState } from 'react'
import ImageUploader from '@/components/file-upload/ImageUploader';
import Image from 'next/image';
import { MaterialIcons } from '@/components/icons/material-ui-icons';
import {  ContactType, PostImage } from '@prisma/client';
import { deleteSingleImageAction } from '@/server-actions/fileUploader';
import { createPost, deletePostFeatures, updatePost } from '@/server-actions/post.actions';
import { FormPriceForm } from './FormPriceForm';
import { PostFeauresForm } from './PostFeaturesForm';
import { VendorContactForm } from './VendorContactForm';
import Link from 'next/link';

const defaultIcon = "https://tiracar-bucket.s3.eu-north-1.amazonaws.com/users/account.png"

// const UPLOAD_PRESET = "weddconnect-preset";

const AddPostForm = ({vendors,categories, post, contactTypes}: {vendors: TVendor[], categories: TCategory[], post: TPost | null, contactTypes: ContactType[]}) => {
     const vendorInputs = new DataInputs();
     const postInputs = new DataInputs();
     const [postImages, setPostImages] = useState<PostImage[]>(post !== null ? post.images :[]);
     const [selectedVendor, setSelectedVendor] = useState(0);
     const [selectedCategory, setSelectedCategory] = useState(0);
     const [addNewVendor, setAddNewVendor] = useState(false);
     const [addingVendor, setAddingVendor] = useState(false);
     const [addingPost, setAddingPost] = useState(false);
     const [addedPost, setAddedPost]  = useState(0);

     
     const updateVendor = async (id:number) => {
          if(post === null) return setSelectedVendor(id);
          try {
               showMainNotification("Updating vendor...", ENotificationType.WARNING);
               const postUpdate = await updatePost(post.id, {vendor: {connect: {id}}});
               if(postUpdate) {
                    showMainNotification("Successfully update the vendor", ENotificationType.PASS);
                    setSelectedVendor(id);
               }
          } catch (error) {
               showMainNotification("Error updating vendor", ENotificationType.FAIL)
          }
     }
     const saveVendor = async (event:ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setAddingVendor(true)
               const checkInput = vendorInputs.checkFieldsIn(['name', 'email']);
               if(!checkInput.status){
                    return showMainNotification(checkInput.message, ENotificationType.WARNING)
               }
               const password = await encryptPassword('vendor@weddconnect');
               const newUser = await createUser({
                    email: vendorInputs.get('email', ''),
                    password,
                    createdAt: new Date(),
                    type: 'vendor',
                    image: defaultIcon
               });
               if(!newUser) return showMainNotification('Error adding new vendor. Try again later.', ENotificationType.FAIL);
               const newVendor = await createVendor({
                    name: vendorInputs.get('name', ''),
                    status: true,
                    user: {connect: {id: newUser.id}}
               });
               if(newVendor){
                    showMainNotification("Successfull save vendor!", ENotificationType.PASS);
                    setSelectedVendor(newVendor.id);
               }else{
                    return showMainNotification('Error adding new vendor. Try again later.', ENotificationType.FAIL);
               }
          } catch (error) {
               showMainNotification("Error adding vendor information", ENotificationType.FAIL)
          }finally{
               setAddNewVendor(false);
          }
     }

     const deleteImage = async (imageDeleted:PostImage) => {
          showMainNotification("Deleting the image...", ENotificationType.WARNING);
          try {
               if(addedPost === 0 && post === null) {
                    return showMainNotification('You need to first create or select a post', ENotificationType.WARNING)
               }
               const postUpdate =  await updatePost(post !== null ? post.id : addedPost, {images: {delete:{id: imageDeleted.id}}})
               
               if(postUpdate) {
                    await deleteSingleImageAction(imageDeleted.url);
                    const newImages = postImages.filter(image => image.url !== imageDeleted.url);
                    setPostImages(newImages);
                    return showMainNotification("Image deleted successfully", ENotificationType.PASS);
               }else {
                    return showMainNotification("Error deleting post Image", ENotificationType.FAIL)
               }
          } catch (error) {
               showMainNotification("Error deleting the image!!", ENotificationType.FAIL)
          }
     }

     const savePost =async  (event: ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setAddingPost(true);
               const check  = post === null ? postInputs.checkFieldsIn(['name', 'description', 'location']) : {status: true, message: ""}
               if(!check.status) return showMainNotification(check.message, ENotificationType.WARNING);
               const newPost = post === null ?  await createPost({
                    title: postInputs.get('name', ''),
                    description: postInputs.get('description', ''),
                    location: postInputs.get('location',''),
                    vendor: {connect: {id: selectedVendor}},
                    category: {connect:{id: selectedCategory}},
                    status:'pending',
                    createdAt: new Date()
               }) : await updatePost(post.id, {title: postInputs.get('name', post.title), description: postInputs.get('description', post.description), location: postInputs.get('location', post.location)});
               if(newPost) {
                    setAddedPost(newPost.id);
                    return showMainNotification(`${post === null? "New post created successfully" : "Post info update successfully"}`, ENotificationType.PASS);
               }else {
                    return showMainNotification(`${post === null? "Error creating new post" : "Error updating post info!! Try again later."}`, ENotificationType.FAIL);
               }
          } catch (error) {
               return showMainNotification("Error adding post", ENotificationType.FAIL);
          }
     }

     const savePostImage =  async (res: string) => {
          try {
               if(addedPost === 0 && post === null) {
                    await deleteSingleImageAction(res);
                    return showMainNotification('You need to first create or select a post', ENotificationType.WARNING)
               }
               const postUpdate = await updatePost(post !== null ? post.id : addedPost, {
                    images: {create: {name: `${post !== null ? post.title : postInputs.get('name', '')} image`, url: res }},
               });
               if(postUpdate){
                    showMainNotification("Success adding post image", ENotificationType.PASS);
                    return setPostImages(prev => ([...prev, {name: `${post?.title} image`, url: res, id: 0, postId: post !== null ? post?.id : addedPost }]) )
               }
          } catch (error) {
               await deleteSingleImageAction(res);
               return showMainNotification("Error saving postImage", ENotificationType.FAIL)
          }
     }

     if(selectedVendor === 0) return (
          <div className='w-full flex items-center  flex-col gap-[20px]'>
               <div className='w-full flex flex-col items-start justify-start gap-[10px] border rounded-[10px] p-[10px]'>
                    <h2 className='text-[1.2] font-bold text-gray-600'>Vendor Information:</h2>
                    <div className='w-full grid grid-cols-2 gap-[10px]'>
                         <button type='button' onClick={() => setAddNewVendor(false)} className={`w-full py-[10px] text-[0.9rem] rounded-[5px]  ${!addNewVendor ? 'bg-blue-600 text-white hover:bg-blue-800 border border-blue-600' : 'bg-white border border-blue-600 text-blue-600'}`} disabled={!addNewVendor}>Select Vendors</button>
                         <button type='button' onClick={() => setAddNewVendor(true)} className={`w-full py-[10px] text-[0.9rem] rounded-[5px]  ${addNewVendor ? 'bg-blue-600 text-white hover:bg-blue-800 border border-blue-600' : 'bg-white border border-blue-600 text-blue-600'}`} disabled={addNewVendor}>Add New Vendor</button>
                    </div>
                    {
                         addNewVendor ? 
                         <form onSubmit={saveVendor} className='w-full flex flex-col items-center justify-start gap-[10px]'>
                              <div className='w-full gap-[5px] grid grid-cols-2'>
                                   <TextInputGroup type='text' name='vendor-name' placeholder='Enter vendor name...' label='Vendor Name:' action={res => vendorInputs.set('name',res,'string')} />
                                   <TextInputGroup type='email' name='vendor-email email...' label='Vendor Email:' action={res => vendorInputs.set('email',res,'Email')} placeholder='ex. dushime@gmail.com' />
                              </div>
                              <button type='submit'  className={`w-full py-[10px] text-[0.9rem] rounded-[5px]  bg-orange-600 text-white hover:bg-orange-800 border border-orange-600`} disabled={addingVendor}>Add New Vendor</button>
                         </form>
                         :
                         <SelectInputGroup name='post vendor' label={post === null ? 'select-vendor' : `Change Vendor: ${post.vendor.name}`} values={vendors.map(vendor => ({label:vendor.name, value: vendor.id}))} action={async res => await updateVendor(Number(res))} />
                    }
                    {
                         post !== null ? 
                              <VendorContactForm vendor={post.vendor} contactTypes={contactTypes} />
                         : null
                    }
                    {post !== null ?  <div className='w-full flex items-center justify-end '>
                         <button type='button' className='px-[10px] py-[5px] text-[0.9rem] border border-gray-300 text-gray-600 rounded-[5px] hover:text-gray-800' onClick={() => setSelectedVendor(post.vendor.id)}>Next</button> 
                    </div> : null}
               </div>
          </div>
     )

     const updateCategory = async (id:number) => {
          try {
               if(post !== null && post.categoryId !== id){
                    showMainNotification('Updating post category...', ENotificationType.WARNING)
                    const postUpdate = await updatePost(post.id, {category:{connect:{id}}});
                    await deletePostFeatures(post.id);
                    if(postUpdate) showMainNotification("Updated post category successfully",ENotificationType.PASS);
                    else showMainNotification('Error updating post category', ENotificationType.FAIL);
               }
               return setSelectedCategory(id);
          } catch (error) {
               return showMainNotification('Error updating the category', ENotificationType.FAIL);
          }
     }

     if(selectedCategory === 0) return (
          <div className='w-full flex flex-col items-start justify-start gap-[10px] border rounded-[10px] p-[10px]'>
               <SelectInputGroup name='post category' label='Select Category:' values={categories.map(category => ({label:category.name, value: category.id}))} action={async res => await updateCategory(Number(res))} />
               <div className='w-full flex items-center justify-end gap-[5px] '>
                    <button type='button' className='px-[10px] py-[5px] text-[0.9rem] border border-gray-300 text-gray-600 rounded-[5px] hover:text-gray-800' onClick={() => setSelectedVendor(0)}>Prev</button>
                    {post !== null ?  <button type='button' className='px-[10px] py-[5px] text-[0.9rem] border border-gray-300 text-gray-600 rounded-[5px] hover:text-gray-800' onClick={() => setSelectedCategory(post.category.id)}>Next</button>  : null}
               </div> 
          </div>
     )

     

    

     return (
          <div className='w-full flex flex-col items-center justify-start gap-[20px]'>
               <div className='w-full flex flex-col items-start justify-start gap-[10px] border rounded-[10px] p-[10px]'>
                    <h2 className='text-[1.2] font-bold text-gray-600'>Post Information:</h2>
                    <form onSubmit={savePost} className='w-full items-start justify-start flex flex-col gap-[10px]'>
                         <TextInputGroup name='post-name' label={`Post Title: ${post?.title}`} placeholder='Enter post title' type='text' action={res => postInputs.set('name', res, 'string')} />
                         <TextInputGroup name='post-name' label={`Post Location: ${post?.title}`} placeholder='ex: Kigali - Gasabo, Chez Lando' type='text' action={res => postInputs.set('location', res, 'string')} />
                         <TextAreaInputGroup defaultValue={post?.description} maxWords={200} label='Short Description: only 200 word' name='post-description' placeholder='describe the post in afew words' action={res => postInputs.set('description', res, 'string')} />
                         <SubmitButton label="Save Post" loadText="Saving post..." loading={addingPost} />
                    </form>
               </div>
               <div className='w-full flex flex-col items-start justify-start gap-[10px] border rounded-[10px] p-[10px]'>
                    <h2 className='text-[1.2] font-bold text-gray-600'>Post Images:</h2>
                    <div className='w-full'>
                    {
                              postImages && postImages.length > 0 ?                    
                              <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-[5px]">
                                   {
                                        postImages.map((image, index) => 
                                        <div key={`listing-update-image-${index}`} className="w-full flex flex-col items-center justify-start gap-[5px] relative">
                                             <Image  width={400} height={300} src={image.url} alt="Listing-update image" layout="responsive" className="w-full rounded-[5px] aspect-auto" />
                                             <button type='button' title="Delete image" className="absolute top-0 right-0 bg-gray-100 rounded-[2.5px] p-[2px] cursor-pointer" onClick={async() => await deleteImage(image)}>
                                                  <MaterialIcons.delete className="text-red-700 hover:text-red-600 text-[20px] " titleAccess="delete image" />
                                             </button>
                                             <h4 className="text-[0.8rem] text-gray-500 text-center w-full">Image {index + 1}</h4>
                                        </div>)
                                   }
                              </div>:
                              <p className="text-[0.8rem] text-gray-700">No Images selected!!</p>
                         }
                    </div>
                    <div className='w-full flex items-center justify-start'>
                         <ImageUploader onUploadComplete={res => savePostImage(res)} />
                    </div>
               </div>
               {addedPost !== 0 || post !== null ? <PostFeauresForm addedPost={addedPost} post={post} categories={categories} selectedCategory={selectedCategory} /> : null}
               {addedPost !== 0 || post !== null ? <FormPriceForm postId={post === null ? addedPost : post.id} postPrice={post !== null ? post.price : null} /> : null}
               <div className='w-full flex items-center justify-end gap-[5px]'>
                    <button type='button' className='px-[10px] py-[5px] text-[0.9rem] border border-gray-300 text-gray-600 rounded-[5px] hover:text-gray-800' onClick={() => setSelectedCategory(0)}>Prev</button>
                    <Link href={'/dashboard/admin/posts'} prefetch={true} className='px-[10px] py-[5px] text-[0.9rem] border border-gray-300 text-gray-600 rounded-[5px] hover:text-gray-800 text-center' >Complete</Link>
               </div>
          </div>
          
     )

}

export default AddPostForm