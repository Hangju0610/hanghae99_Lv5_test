const PostRepository = require('../../repositories/posts.repository');

// posts.repository.js에서 사용하는 method
let mockPostsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
};

let postRepository = new PostRepository(mockPostsModel);

describe('Layered Architecture Pattern Post Reposityro Unit Test', () => {
  //각 test가 실행되기 전에 실행된다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('DB에서 개시글 전체 조회하기 성공 test', async () => {
    // findAll Mock의 Return 값을 객체로 설정합니다.
    mockPostsModel.findAll = jest.fn(() => {
      return {
        postId: 1,
        userId: 1,
        title: 'title',
        likes: 1,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        'Users.nickname': 'test',
      };
    });

    // postRepository의 findAllPost Method를 호출합니다.
    const allPost = await postRepository.findAllPost();

    // postsModel의 findAll은 1번만 호출 되었습니다.
    expect(postRepository.postsModel.findAll).toHaveBeenCalledTimes(1);

    // mockPostsModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
    expect(allPost).toEqual({
      postId: 1,
      userId: 1,
      title: 'title',
      likes: 1,
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
      'Users.nickname': 'test',
    });
  });

  //
  test('DB에서 게시글 하나만 조회하기 성공 test', async () => {
    mockPostsModel.findOne = jest.fn(() => {
      return {
        postId: 1,
        userId: 1,
        title: 'title',
        content: 'content',
        likes: 1,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        'Users.nickname': 'test',
      };
    });

    // postId Params 설정
    const findOnePostParams = {
      postId: 1,
    };

    // 2. post 변수 선언 및 findOne Method 호출
    const post = await postRepository.findPostByPostId(
      findOnePostParams.postId
    );

    // 호출 횟수 : 1회
    expect(postRepository.postsModel.findOne).toHaveBeenCalledTimes(1);

    // mockPostsModel의 Return과 출력된 findAll method의 값이 일치하는지 비교합니다.
    expect(post).toEqual({
      postId: 1,
      userId: 1,
      title: 'title',
      content: 'content',
      likes: 1,
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
      'Users.nickname': 'test',
    });

    // postRepository의 findPostByPostId Method를 실행했을 때,
    // postsModel의 findOne은 아래와 같은 값으로 호출합니다.
    expect(postRepository.postsModel.findOne).toHaveBeenCalledWith(
      findOnePostParams.postId
    );
  });

  // 좋아요한 게시물 찾기 TestCode
  test('좋아요한 게시글 찾기 성공 test', async () => {
    // findAll의 mock을 객체로 반환
    mockPostsModel.findAll = jest.fn(() => {
      return {
        postId: 1,
        userId: 1,
        title: 'title',
        likes: 1,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        'Users.nickname': 'test',
      };
    });

    // 2. 매개변수 userId Params 설정
    const findAllPostParams = {
      userId: 1,
    };

    // 3. allpost 변수 선언 및 findPostOrderLike 호출
    const allPost = await postRepository.findPostOrderLike(
      findAllPostParams.userId
    );

    // 4. findAll의 호출 횟수 확인
    expect(postRepository.postsModel.findAll).toHaveBeenCalledTimes(1);

    // 5. 호출 인자 확인
    expect(postRepository.postsModel.findAll).toHaveBeenCalledWith(
      findAllPostParams.userId
    );

    // 6. return 출력값 확인
    expect(allPost).toEqual({
      postId: 1,
      userId: 1,
      title: 'title',
      likes: 1,
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
      'Users.nickname': 'test',
    });
  });

  test('편집 및 삭제 권한용 DB 데이터 확인 성공 Test', async () => {
    // 1. findOne의 mock 객체 반환
    mockPostsModel.findOne = jest.fn(() => {
      return 'findAll String';
    });

    // 2. params 설정
    const Params = {
      postId: 1,
      userId: 1,
    };
    // 3. 변수 선언 및 validatePostByUserId 설정
    const validatePost = await postRepository.validatePostByUserId(
      Params.postId,
      Params.userId
    );

    // 4. findOne의 호출 횟수 확인
    expect(postRepository.postsModel.findOne).toHaveBeenCalledTimes(1);

    // 5. Params 호출 확인
    expect(postRepository.postsModel.findOne).toHaveBeenCalledWith(
      Params.postId,
      Params.userId
    );

    // 6. return 출력값 확인
    expect(validatePost).toBe('findAll String');
  });

  test('게시판 생성 Repository 성공 test', async () => {
    //mock의 return 값 설정
    mockPostsModel.create = jest.fn(() => {
      return 'create Return String';
    });

    // 2. Params 설정
    const createParams = {
      userId: 1,
      title: 'title',
      content: 'content',
    };
    // 3. method 실행
    const createPostData = await postRepository.createPost(
      createParams.userId,
      createParams.title,
      createParams.content
    );

    // 4. return 값 확인
    expect(createPostData).toMatch('create Return String');

    // 5. 실행 횟수
    expect(mockPostsModel.create).toHaveBeenCalledTimes(1);

    // 6. params 호출 확인
    expect(mockPostsModel.create).toHaveBeenCalledWith({
      userId: createParams.userId,
      title: createParams.title,
      content: createParams.content,
    });
  });

  test('게시판 수정 Repository 성공 test', async () => {
    // mock의 return 값 설정
    mockPostsModel.update = jest.fn(() => {
      return 'update Return String';
    });

    // 2. Params 설정
    const updateParams = {
      postId: 1,
      title: 'title',
      content: 'content',
    };

    // 3. method 실행
    const updatePostData = await postRepository.updatePost(
      updateParams.postId,
      updateParams.title,
      updateParams.content
    );
    // 4. return 값 확인
    expect(updatePostData).toMatch('update Return String');

    // 5. 실행 횟수
    expect(mockPostsModel.update).toHaveBeenCalledTimes(1);

    // 6. params 호출 확인
    expect(mockPostsModel.update).toHaveBeenCalledWith({
      postId: updateParams.postId,
      title: updateParams.title,
      content: updateParams.content,
    });
  });

  test('게시판 삭제 Repository 성공 test', async () => {
    mockPostsModel.destroy = jest.fn(() => {
      return 'delete Return String';
    });

    const deleteParams = {
      postId: 1,
    };

    const deletePostData = await postRepository.deletePost(deleteParams.postId);

    expect(deletePostData).toMatch('delete Return String');

    expect(mockPostsModel.destroy).toHaveBeenCalledTimes(1);

    expect(mockPostsModel.destroy).toHaveBeenCalledWith({
      postId: deleteParams.postId,
    });
  });
});
