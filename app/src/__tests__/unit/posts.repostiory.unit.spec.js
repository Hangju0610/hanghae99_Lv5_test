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
        createdAt: 'aa',
        updatedAt: 'aa',
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
      createdAt: 'aa',
      updatedAt: 'aa',
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
        likes: 1,
        createdAt: 'aa',
        updatedAt: 'aa',
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
      likes: 1,
      createdAt: 'aa',
      updatedAt: 'aa',
      'Users.nickname': 'test',
    });

    // postRepository의 findPostByPostId Method를 실행했을 때,
    // postsModel의 findOne은 아래와 같은 값으로 호출합니다.
    expect(postRepository.postsModel.findOne).toHaveBeenCalledWith(
      findOnePostParams.postId
    );
  });

  // 편집 및 삭제 권한용 DB 데이터 확인 test 성공 case
  test();
});
