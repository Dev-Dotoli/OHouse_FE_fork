import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../server/api";
import { postAPI } from "../../server/api";

const initialState = {
  post: [],
  isLoading: false,
  error: null,
  last: false,
  totalPage: 0,
};

export const getHouseList = createAsyncThunk(
  "house/getHouseList ",
  async (payload, thunkAPI) => {
    try {
      const data = await axios.get("http://localhost:3001/post");
      // console.log(data.data);
      return thunkAPI.fulfillWithValue(data.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//무한스크롤
export const getInfiniteList = createAsyncThunk(
  "house/getInfiniteList ",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.get(
        `/post?page=${payload}&size=6&sort=createdAt,desc`
      ); //3의 배수
      return thunkAPI.fulfillWithValue(data.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 게시글 post
export const _addPost = createAsyncThunk(
  "post/posts",
  async (payload, thunkAPI) => {
    try {
      console.log("payload", payload);

      const data = await postAPI.writePost(payload);
      console.log(data);

      return thunkAPI.fulfillWithValue(data.data);
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 디테일 get
export const _getDetail = createAsyncThunk(
  "travel/getDetail ",
  async (post_id, thunkAPI) => {
    try {
      console.log("post_id =", post_id);
      const data = await postAPI.getPost(post_id);
      console.log(data.data);

      return thunkAPI.fulfillWithValue(data.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const post = createSlice({
  name: "post",
  initialState,
  reducers: {
    //  initial:(state,action) =>{
    //  return initialState
    //  }
  },
  extraReducers: {
    // getHouseList Thunk
    [getHouseList.pending]: (state) => {
      state.isLoading = true; // 네트워크 요청이 시작되면 로딩상태를 true로 변경합니다.
    },
    [getHouseList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.post = action.payload;
      // console.log(state);
    },
    [getHouseList.rejected]: (state, action) => {
      state.isLoading = false; // 에러가 발생했지만, 네트워크 요청이 끝났으니, false로 변경합니다.
      state.error = action.payload; // catch 된 error 객체를 state.error에 넣습니다.
    },

    [getInfiniteList.pending]: (state) => {
      state.isLoading = true; // 네트워크 요청이 시작되면 로딩상태를 true로 변경합니다.
    },
    [getInfiniteList.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.post = [...state.post, ...action.payload.content];
      state.last = action.payload.last;
      state.totalPage = action.payload.totalPages;
      console.log(action.payload.content);
    },

    [_addPost.pending]: (state) => {
      state.isLoading = true;
    },
    [_addPost.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.posts = action.payload;
      console.log("_addPost", action.payload);
    },
    [_addPost.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
export default post.reducer;
export const { initial } = post.actions; // 액션내보내기
