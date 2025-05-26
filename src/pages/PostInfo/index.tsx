import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components';
import { samplePost } from '../../utils/mockdata';

type Props = {
    post?: any;
}

const PostInfo = ({post}: Props) => {
    // const params = useParams<{ id: string}>();
    const {id} = useParams<{ id: string}>();
    post = samplePost;

    console.log("params", id);
    
  return (
    <StylePostInfo>
        <div className="w-full max-w-5xl mx-auto flex bg-white shadow rounded-lg overflow-hidden">
            {/* Left: Image */}
            <div className="w-1/2 bg-black">
                <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-full object-cover"
                />
            </div>

            {/* Right: Info */}
            <div className="w-1/2 flex flex-col">
                {/* Header: Avatar + Name + Location */}
                <div className="flex items-center gap-3 p-4 border-b">
                <img
                    src={post.avatarUrl}
                    alt={post.username}
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <div className="font-semibold">{post.username}</div>
                    {post.location && (
                    <div className="text-sm text-gray-500">{post.location}</div>
                    )}
                </div>
                </div>

                {/* Caption */}
                {post.caption && (
                <div className="p-4 text-sm text-gray-800 border-b">
                    {post.caption}
                </div>
                )}

                {/* Bottom Placeholder for Comment / Actions */}
                <div className="flex-1 p-4">
                {/* Bạn sẽ thêm phần comment ở đây */}
                </div>
            </div>
            </div>
    </StylePostInfo>
  )
}

const StylePostInfo = styled.div`
    
`

export default PostInfo