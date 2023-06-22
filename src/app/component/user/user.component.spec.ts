
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user.component';
import { UserService } from '../../service/user.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from 'src/app/model/user';
import { of} from 'rxjs';

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let serviceMock:any;
    let userService: UserService;
    const user: User = {
      id: 1,       
      title: 'Title',
      description: 'Description',
      instructor: 'Instructor',
      duration: 'duration',
      startDate: new Date('2022-01-01'),
      endDate:new Date('2023-01-01'),
      syllabus: 'syllabus'
    }
  
    let mockService = {
      getAllUsers: ()=>{return of([user])},
      deleteUser: (id:number|string)=>{return of(user)},
      getUser: ()=>{
        return of([user])
      },
    }

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [UserComponent],
        imports: [FormsModule,ReactiveFormsModule,HttpClientModule,HttpClientTestingModule] ,
        providers: [FormBuilder, UserService,HttpTestingController,{provide: UserService, useValue: mockService}] 
      }).compileComponents();
    });

    beforeEach(() => {
      serviceMock={
        getAllUsers:jest.fn(),   
        createUser:jest.fn(),
        updateUser:jest.fn(),
        deleteUser:jest.fn(),
        searchByTitle:jest.fn(),
        searchByStartDate:jest.fn(), 
        };

      fixture = TestBed.createComponent(UserComponent);
      component = fixture.componentInstance;
      userService = TestBed.inject(UserService);
      fixture.detectChanges();
    });

    describe("business", ()=>{

        it('should create the user component', () => {
          expect(component).toBeTruthy();
        });

        it('should declare user form referece',()=>{
          expect(component.userForm).toBeDefined();
        })

        it('should initialize the form',()=>{
          const userForm={
            id:null,       
            title: '',
            description: '',
            instructor: '',
            duration: '',
            startDate: '',
            endDate:'',
            syllabus: ''
          };
          expect(component.userForm.value).toEqual(userForm);
        });
    });

    describe('business',()=>{       

      it('should validate the title field in the form', () => {
        const c = component.userForm.controls['title'];      
        c.setValue('Title1'); 
        expect(c.valid).toBeTruthy();   
        c.setValue(''); 
        expect(c.invalid).toBeTruthy(); 
        c.setValue('Ti'); 
        expect(c.invalid).toBeTruthy();
        c.setValue('aaaa aaa aaa aaaaa aaaaaaaaaaa aaaaaaaaa a a a a a  a a a a a aaaaaaa aaa aaaaaaa aaa aaaa aaaaaa aaa aaaa aaaaaaa aaaaaa aaaaa aaaaaaaaa aaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaa aaaaaaa aaaaa aaaaaaaa aaaaaaaa aaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaa aaaaaaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaaa aaaaaaa aaaaa aaaa');    
        expect(c.invalid).toBeTruthy();
      });

      it('should validate the description field in the form', () => {
        const c = component.userForm.controls['description'];        
       c.setValue('description');    
        expect(c.valid).toBeTruthy();    
       c.setValue('');    
        expect(c.invalid).toBeTruthy(); 
      });

      it('should validate the instructor field in the form', () => {
        const c = component.userForm.controls['instructor'];        
       c.setValue('instructor');    
        expect(c.valid).toBeTruthy();    
       c.setValue('');    
        expect(c.invalid).toBeTruthy(); 
      });

      it('should validate the duration field in the form', () => {
        const c = component.userForm.controls['duration'];        
       c.setValue('1 month');    
        expect(c.valid).toBeTruthy();    
       c.setValue('');    
        expect(c.invalid).toBeTruthy();   
      });

   
      it('should  validate the startDate field in the form', () => {
        const c = component.userForm.controls['startDate'];        
       c.setValue('2022-01-01');    
        expect(c.valid).toBeTruthy();    
       c.setValue('');    
        expect(c.invalid).toBeTruthy(); 
      });

      it('should validate the endDate field in the form', () => {
        const c = component.userForm.controls['endDate'];        
       c.setValue('2023-01-01');    
        expect(c.valid).toBeTruthy();    
       c.setValue('');    
        expect(c.valid).toBeTruthy(); 
      });

      it('validates the syllabus field in the form', () => {
        const c = component.userForm.controls['syllabus'];        
       c.setValue('syllabus1');    
        expect(c.valid).toBeTruthy();    
        c.setValue('');    
        expect(c.valid).toBeTruthy();   
      });


    });
  
   describe("boundary", ()=>{

      it('should invalidate the form when title length  is greater than 100', () => {
        const form = component.userForm;
        form.controls['title'].setValue('aaaa aaaa aaaaa aaaaa aa aaaaaaaaaa aaaaaaaaaa aaaa  aaaa aaaa aaaaa aaaaa aa aaaaaaaaaa aaaaaaaaaa aaaa aaaa aaaaa aaaaa aa aaaaaaaaaaaaaaaaaaaa');
        expect(form.invalid).toBeTruthy();
        expect(form.controls['title'].errors?.['maxlength']).toBeTruthy();
      });

      it('should invalidate the form when title length is less than 3', () => {
        const form = component.userForm;
        form.controls['title'].setValue('Ti');
        expect(form.invalid).toBeTruthy();
        expect(form.controls['title'].errors?.['minlength']).toBeTruthy();
      });

   });

    describe('business',()=>{

      it('should validate the form ',()=>{
        component.userForm.controls['id'].setValue(1);
        component.userForm.controls['title'].setValue('title');
        component.userForm.controls['description'].setValue('description');
        component.userForm.controls['instructor'].setValue('instructor');
        component.userForm.controls['duration'].setValue('1 month');
        component.userForm.controls['startDate'].setValue(new Date('2022-01-01'));
        component.userForm.controls['endDate'].setValue(new Date('2023-01-01'));
        component.userForm.controls['syllabus'].setValue('syllabus');
        expect(component.userForm.valid).toBeTruthy();
      });

        it('should disable the submit button when the form is invalid', () => {
        const form = component.userForm;
        form.controls['title'].setValue('');
        form.controls['description'].setValue('');
        form.controls['instructor'].setValue('');
        form.controls['duration'].setValue('');
        form.controls['startDate'].setValue('');
        form.controls['endDate'].setValue('');
        form.controls['syllabus'].setValue('');
        fixture.detectChanges();    
        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
        expect(submitButton.disabled).toBe(true);
      });

      it('should enable the submit button when the form is valid', () => {
        const form = component.userForm;
        component.userForm.controls['title'].setValue('title1');
        component.userForm.controls['description'].setValue('description1');
        component.userForm.controls['instructor'].setValue('instructor1');
        component.userForm.controls['duration'].setValue('duration1');
        component.userForm.controls['startDate'].setValue(new Date('2022-01-01'));
        component.userForm.controls['endDate'].setValue(new Date('2023-01-01'));
        component.userForm.controls['syllabus'].setValue('syllabus');
        fixture.detectChanges();        
        const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
        expect(submitButton.disabled).toBe(false);
      });
    });

  describe('exception',()=>{

    it('should invalidate the form when empty',()=>{
      component.userForm.controls['id'].setValue('');
      component.userForm.controls['title'].setValue('');
      component.userForm.controls['description'].setValue('');
      component.userForm.controls['instructor'].setValue('');
      component.userForm.controls['duration'].setValue('');
      component.userForm.controls['startDate'].setValue('');
      component.userForm.controls['endDate'].setValue('');
      component.userForm.controls['syllabus'].setValue('');
      expect(component.userForm.valid).toBeFalsy();
    });  
    
    it('should required title field', () => {
      const c = component.userForm.controls['title']
      expect(c.valid).toBeFalsy();      
      c.setValue('');
      expect(c.hasError('required')).toBeTruthy();      
    });
    
    it('should required description field', () => {
      const c = component.userForm.controls['description']
      expect(c.valid).toBeFalsy();      
      c.setValue('');
      expect(c.hasError('required')).toBeTruthy();      
    });
    
    it('should required duration field', () => {
      const c = component.userForm.controls['duration']
      expect(c.valid).toBeFalsy();      
      c.setValue('');
      expect(c.hasError('required')).toBeTruthy();      
    });
    
    it('should required startDate field', () => {
      const c = component.userForm.controls['startDate']
      expect(c.valid).toBeFalsy();      
      c.setValue('');
      expect(c.hasError('required')).toBeTruthy();      
    });

    it('endDate field validity', () => {
      const c = component.userForm.controls['endDate']
      expect(c.invalid).toBeFalsy();      
      c.setValue('');
      expect(c.hasError('required')).toBeFalsy();      
    });

    it('syllabus field validity', () => {
      const c = component.userForm.controls['syllabus']
      expect(c.invalid).toBeFalsy();      
      c.setValue('');
      expect(c.hasError('required')).toBeFalsy();      
    });  
  });

      describe("business", ()=>{
            it('should fetch all users', ()=>{    
              component.users=[];
              jest.spyOn(mockService, 'getAllUsers').mockReturnValue(of([user]));
              component.getAllUsers();        
              expect(component.users.length).toBeGreaterThan(0);    
              expect(Array.isArray(component.users)).toBe(true);
            }) 
            
            it('should delete user by id', ()=>{  
              jest.spyOn(mockService, 'deleteUser').mockReturnValue(of(user));
              component.deleteUser(1);      
              expect(mockService.deleteUser).toBeCalledTimes(1);
              expect(mockService.deleteUser).toBeCalledWith(1);
          
            })
          
            it('should get user  by id', ()=>{  
              jest.spyOn(mockService, 'getUser')
              component.getUserById(1);      
              expect(mockService.getUser).toBeCalledTimes(1);
              expect(mockService.getUser).toBeCalledWith(1);
          
            })

      });
});


